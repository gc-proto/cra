	/*Binds a navigation button for keyboard/screen readers to skip to the section navigation menu at the top of the template page */
		(function( $, document, wb ) {
	"use strict";
if($('.gcnav-menu').length> 0){
	var pgLang = $("html").prop("lang");
	/*Language change */
	switch( pgLang.toLowerCase() ){
		case "fr":
			var gcNav = 'Passer au menu de navigation de la section'
			break;
		case "en":
		default:
			var gcNav = 'Skip to section navigation menu'
			break;
		}
	
	/*HTML code to inject */
	$( "#wb-tphp" ).prepend('<li class="wb-slc"><a class="wb-sl" href="#gcnav-menu-header">' + gcNav + '</a></li>' );
}
})( jQuery, document, wb );			
