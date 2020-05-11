
$( ".custom-bg-img" ).each(function() {
  var attr = $(this).attr('data-image-src');
  if (typeof attr !== typeof undefined && attr !== false) {
      $(this).css('background-image', 'url('+attr+')');
  }
});
