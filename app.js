  
var movile_api_key  = "b34a27ddbe5b446372b5cd2724b12f90";

var ajax = {};
ajax.x = function () {
    if (typeof XMLHttpRequest !== 'undefined') {
        return new XMLHttpRequest();
    }
    var versions = [
        "MSXML2.XmlHttp.6.0",
        "MSXML2.XmlHttp.5.0",
        "MSXML2.XmlHttp.4.0",
        "MSXML2.XmlHttp.3.0",
        "MSXML2.XmlHttp.2.0",
        "Microsoft.XmlHttp"
    ];

    var xhr;
    for (var i = 0; i < versions.length; i++) {
        try {
            xhr = new ActiveXObject(versions[i]);
            break;
        } catch (e) {
        }
    }
    return xhr;
};

ajax.send = function (url, callback, method, data, async) {
    if (async === undefined) {
        async = true;
    }
    var x = ajax.x();
    x.open(method, url, async);
    x.onreadystatechange = function () {
        if (x.readyState == 4) {
            callback(x.responseText)
        }
    };
    if (method == 'POST') {
        x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
    x.send(data)
};

ajax.get = function (url, data, callback, async) {
    var query = [];
    for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async)
};

ajax.post = function (url, data, callback, async) {
    var query = [];
    for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    ajax.send(url, callback, 'POST', query.join('&'), async)
};

  function showDiv(show) {
    var s = document.getElementById(show);
    if (!s) {
        return true;
    }
    s.style.display = "block";
    return true;
}

var scrollTo = function(element) {
  element.scrollIntoView();
   
}

var hideDiv = function(hide) {
    var h = document.getElementById(hide);
    if (!h) {
        return true;
    }
    h.style.display = "none";
    return true;
}
var t_show = function() {
    if (document.getElementById("t_show").checked) {
        showDiv("t_settings");
    }
    else {
        hideDiv("t_settings");
    }
}

var process_active_state = function(elem) {
    // get all 'a' elements
    var a = document.getElementsByTagName('li');
    // loop through all 'a' elements
    for (i = 0; i < a.length; i++) {
        // Remove the class 'active' if it exists
        a[i].classList.remove('active')
    }
    // add 'active' classs to the element that was clicked
    elem.classList.add('active');
}

var process_tab = function(elem,tab_id){

var tabs = document.getElementsByClassName('tab-pane');
var i = 0;
for(i=0;i<tabs.length;i++){
tabs[i].style.display='none';
}

showDiv(tab_id);
process_active_state(elem);
get_movies_by_category(tab_id);

}

var short_string_maker = function(target_string,maxLength){
 

//trim the string to the maximum length
var trimmedString = target_string.substr(0, maxLength);

//re-trim if we are in the middle of a word
trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));

return trimmedString+'...';
}

var get_movies_by_category = function(category){
ajax.get('https://api.themoviedb.org/3/movie/'+category, {api_key: movile_api_key}, function(res){

  var response = JSON.parse(res);
  //console.log(category);
  //console.log(response);

  var i = 0;
  var formated_category_name = category.replace(/[^a-zA-Z ]/g, " ").toLowerCase().replace(/\b[a-z](?=[a-z]{2})/g, function(letter) {
    return letter.toUpperCase(); } );

  var html='<div class="row"><div class="page-header"><h2>'+formated_category_name+' Movies </h2></div>';
  var movie = '';
  var poster ='';
  for(i=0;i<response.results.length;i++){
    movie = response.results[i];
    var release_date = new Date(movie.release_date);
    var release_year = release_date.getFullYear();
    var description = short_string_maker(movie.overview,130);
    var selected="";
    if(i==0){
      selected= "selected";
    }


    var is_mode = i % 2;

    var clear ="";
    if(!is_mode){
      clear ="clear_both"
    }

    html+='<div class="col-sm-6 single_movie '+clear+' '+selected+'"><div class="row ">';
    poster ='<div class="col-sm-4"><img alt="'+movie.title+'" class="img-thumbnail" src="http://image.tmdb.org/t/p/w150/'+movie.poster_path+'"/></div>';
    html+=poster;
    html+='<div class="col-sm-8"><ul class="list-group">'+

          '<li class="list-group-item">'+ 
          
          '<span><strong>'+movie.title+'</strong></span>'+
          '<span class="float-right">'+movie.vote_average+'<img src="./images/star.png" class="star"></span><br/>'+
          '<span class="float-right">'+release_year+'<img src="./images/calendar.png" class="movie_normal_icon"></span><br/>'+
          '<p>'+description+'</p><br/><br/>'+
          '<hr/>'+
          '<span>More Info</span>'+
          '</li>'+
          '</ul></div>'


          ;
    html+='</div></div>';
   


  }

  html+="</div>"

  document.getElementById(category).innerHTML = html;
  bind_arrow_events();

});
}

var isHidden = function(el) {
   return (el.offsetParent === null);
}
var hasClass = function(element, cls) {


  if(!element){
    return false;
  }else{
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }

    
}



var go_next = function(){
  var selected = document.querySelectorAll(".single_movie.selected");
   var className = "selected";
   var i = 0;
   var clickedElement = null;
   for(i=0;i<selected.length;i++){
       if(!isHidden(selected[i])){
        clickedElement = selected[i];
        ////console.log(i);
       }
   }

   if(clickedElement){
    var element = clickedElement;
   ////console.log(element.nextSibling.className);
    //console.log(element.nextSibling);

    if(hasClass(element.nextSibling, 'single_movie')){
       // //console.log(element.nextSibling.className);
        element.classList.remove('selected');
        element.nextSibling.classList.add('selected');
        scrollTo(element.nextSibling);
        
      }

   
   }
   
   
    ////console.log(selected);
}

var go_skip_next = function(){
  var selected = document.querySelectorAll(".single_movie.selected");
   var className = "selected";
   var i = 0;
   var clickedElement = null;
   for(i=0;i<selected.length;i++){
       if(!isHidden(selected[i])){
        clickedElement = selected[i];
        ////console.log(i);
       }
   }

   if(clickedElement){
    var element = clickedElement;
   ////console.log(element.nextSibling.className);
    ////console.log(element.nextSibling);
    if(hasClass(element.nextSibling.nextSibling, 'single_movie')){
          element.classList.remove('selected');
          element.nextSibling.nextSibling.classList.add('selected');
          scrollTo(element.nextSibling.nextSibling);

        }
   }
   
   
    ////console.log(selected);
}

var go_previous = function(){
  var selected = document.querySelectorAll(".single_movie.selected");
   var className = "selected";
   var i = 0;

   var clickedElement = null;
   for(i=0;i<selected.length;i++){
       if(!isHidden(selected[i])){
        clickedElement = selected[i];
        ////console.log(i);
       }
   }

if(clickedElement){
     var element = clickedElement;
     ////console.log(element.nextSibling.className);
      if(hasClass(element.previousSibling, 'single_movie')){
          // //console.log(element.previousSibling);
           element.classList.remove('selected');
           element.previousSibling.classList.add('selected');
           scrollTo(element.previousSibling);
      }
    
}
 
   
    ////console.log(selected);
}

var go_skip_previous = function(){
  var selected = document.querySelectorAll(".single_movie.selected");
   var className = "selected";
   var i = 0;

   var clickedElement = null;
   for(i=0;i<selected.length;i++){
       if(!isHidden(selected[i])){
        clickedElement = selected[i];
        ////console.log(i);
       }
   }

if(clickedElement){
     var element = clickedElement;
     ////console.log(element.nextSibling.className);
     //
      if(hasClass(element.previousSibling.previousSibling, 'single_movie')){
    ////console.log(element.previousSibling);
    element.classList.remove('selected');
    element.previousSibling.previousSibling.classList.add('selected');
    scrollTo( element.previousSibling.previousSibling);
      }
     
}
 
   
    ////console.log(selected);
}

var bind_arrow_events = function(){
document.onkeydown = function(e) {
    e = e || window.event;

    //console.log(e.which);

    //console.log(e.keyCode);

    switch(e.which || e.keyCode) {
        case 37: // left
        go_previous();
        break;

        case 38: // up
        go_skip_previous();
        break;

        case 39: // right
        go_next();
        break;

        case 40: // down
         go_skip_next();
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
};

}

var default_selecter = function(){

}

var initiate = function(){
   var a = document.getElementsByClassName('tab_head');
   //console.log(a);
   process_tab(a[0],'popular');

   get_movies_by_category('popular');
   get_movies_by_category('top_rated');
   get_movies_by_category('upcoming');
   get_movies_by_category('now_playing');

   

}
window.onload = initiate;
