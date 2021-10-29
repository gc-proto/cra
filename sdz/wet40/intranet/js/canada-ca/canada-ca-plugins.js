/*global $ */

$(function () {
    "use strict";
     
  
 	var wbFieldflow = $(".wb-fieldflow");
     var wbUrlmapping = $(["data-wb-urlmapping"]);
   var wbDoaction = $(["data-wb-doaction"]);

   
  //Load Field Flow Javascript
    if (wbFieldflow.length !== 0) {
       jQuery.ajax({
      url: "/wet40/intranet/js/canada-ca/fieldflow.js",
      dataType: "script",
      cache: true
}).done(function() {
		jQuery.cookie("cookie_name", "value", { expires: 7 });
}); 
    }   
//Load Action Manager Javascript
    if (wbUrlmapping.length !== 0 || wbDoaction.length !== 0) {
        $.getScript("/wet40/intranet/js/canada-ca/actionmng.js")
        .fail(function() {
            console.log("WB Action Manager Javascript not loaded.");
        });
    }   	
	//Load URL Mapping Javascript
    if (wbUrlmapping.length !== 0) {
        $.getScript("/wet40/intranet/js/canada-ca/urlmapping.js")
        .fail(function() {
            console.log("WB URL Mapping Javascript not loaded.");
        });
    } 
	//Load Do Action Javascript
    if (wbDoaction.length !== 0) {
        $.getScript("/wet40/intranet/js/canada-ca/doaction.js")
        .fail(function() {
            console.log("WB Do Action Javascript not loaded.");
        });
    } 
	
   
});
