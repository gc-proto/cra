// AJAX anchor scroll script 
$( document ).ajaxComplete(function() 
{
var hashtag = location.hash.substr(1);
var elmnt = document.getElementById(hashtag);
if(elmnt){elmnt.scrollIntoView();}
 //empty hash
});
