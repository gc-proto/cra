/* Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
Terms and conditions of use: http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Terms
Conditions régissant l'utilisation : http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Conditions
*/

/*
@author Ian de Carufel
@version 3.1
@description A jQuery port of the Opening new window solution.
@original source: Opening new window solution (http://www.gcpedia.gc.ca/wiki/Opening_new_window_solution_%28CLF%29)
*/

var newWindow = {
	params :  Utils.loadParamsFromScriptID("newwindow") ,
	dictionary : {
				// Initial bilingual versions of content found in <a> tags title attribute.
					iniTitle : (PE.language == "eng" ) ? "External link" : "Lien externe" ,
				// Modified bilingual versions of content found in <a> tags title attribute.
					modTitle : (PE.language == "eng" ) ? "Opens in a new window" : "Ouvre dans une nouvelle fen&#234;tre"
				},
				
	init: function() {		
		// Find all anchor elements with rel="internal"
		$("a[rel='internal']", "#cn-cols").each(function() {
			if (jQuery(this).find('span > span').html() == null) { // Anchor element does not contain nested span elements
				if (!jQuery(this).attr('class')) jQuery(this).attr('class', "cn-internal2 cn-linkdesc"); // Class value not specified so add new values
				else jQuery(this).attr('class', jQuery(this).attr('class') + " cn-internal2 cn-linkdesc"); // Class value already exist so append new values
				jQuery(this).append("<span><span> " + newWindow.dictionary.modTitle + "</span></span>"); // Append nested spans with open new window warning
			} else { // Anchor element contains nested span elements
				jQuery(this).attr('class', jQuery(this).attr('class') + " cn-internal2"); // Append cn-internal2 since cn-linkdesc should already be specified
				jQuery(this).find('span > span').append(" (" + newWindow.dictionary.modTitle + ")"); // Append open new window warning to hidden link description
			}

			jQuery.clickOrEnter( this , function(target) {
			while (jQuery(target).attr('href') === undefined) {
			target = jQuery(target).parent();
			}
			window.open(jQuery(target).attr('href'));
			});
			
		});
		
		// Find all anchor elements with rel="external"
		$("a[rel='external']", "#cn-cols").each(function() {
			if (jQuery(this).find('span > span').html() == null) { // Anchor element does not contain nested span elements
				if (!jQuery(this).attr('class')) jQuery(this).attr('class', "cn-external2 cn-linkdesc"); // Class value not specified so add new values
				else jQuery(this).attr('class', jQuery(this).attr('class') + " cn-external2 cn-linkdesc"); // Class value already exist so append new values
				jQuery(this).append("<span><span> " + newWindow.dictionary.iniTitle + ", " + newWindow.dictionary.modTitle + "</span></span>"); // Append nested spans with external link and open new window warnings
			} else { // Anchor element contains nested span elements
				jQuery(this).attr('class', jQuery(this).attr('class') + " cn-external2"); // Append cn-external2 since cn-linkdesc should already be specified
				jQuery(this).find('span > span').each(function() { // Traverse to the inner nested span
					/*if (jQuery(this).html().search(newWindow.dictionary.iniTitle) > -1) jQuery(this).append(", " + newWindow.dictionary.modTitle); // External link warning already exists so append the open new window warning*/
					if (jQuery(this).html().search(newWindow.dictionary.iniTitle) == (jQuery(this).html().length - newWindow.dictionary.iniTitle.length)) jQuery(this).append(", " + newWindow.dictionary.modTitle); // External link warning already exists so append the open new window warning
					else jQuery(this).append(" (" + newWindow.dictionary.iniTitle + ", " + newWindow.dictionary.modTitle + ")"); // // External link warning does not exists so append the external link and open new window warnings
				});
			}

			jQuery.clickOrEnter( this , function(target) { 
			while (jQuery(target).attr('href') === undefined) {
			target = jQuery(target).parent();
			}
			window.open(jQuery(target).attr('href')); 
			});
		});
	}
};

/*
@author Bryan Gullan
@version 1.2
@description Bind mouse click and enter key to a given element. On Click or Enter, specified function is called and default event action blocked. The function called is aware of the target of the click / enter keypress.

Sample use is to add popup to a link, where the href would be followed if javascript were turned off.

var popup = function(target) {
	alert('activated'+ $(target).attr('href'));
};
$(document).ready(function() {
	$.clickOrEnter('a',popup);
});

(c) 2007 Bryan Gullan.
Use and distribute freely with this header intact
*/

jQuery.clickOrEnter = function(element,callback) {
	jQuery(element).bind('click', function(event) {
  		callback(event.target);
  		event.preventDefault(); //prevent browser from following the actual href
	});
	jQuery(element).bind('keypress', function(event) {
		var code=event.charCode || event.keyCode;
		if(code && code == 13) {// if enter is pressed
  			callback(event.target);
  			event.preventDefault(); //prevent browser from following the actual href
		};
	});
};


/**
 *  Progress Enhancement Runtime
 **/
	
// Add the stylesheet for this plugin
Utils.addCSSSupportFile(Utils.getSupportPath() + "/newwindow/style.css");
$("document").ready(function(){   newWindow.init(); });