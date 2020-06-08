	/*Binds a navigation button for keyboard/screen readers to skip to the section navigation menu at the top of the template page */
if($('.gcnav').length> 0){
	pgLang = $("html").prop("lang");
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
