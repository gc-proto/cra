// Vertical datatable headers with AJAX
$(function() {
	  "use strict";	
var table =	$(".table-vertical-header");
var heading = function() {
	var $th = $(this).find("thead th");
var $td = $(this).find("tbody tr td");	
$td.attr('data-header', function () {
    return $th.eq($(this).index()).text();
});
	}

  	table.each(heading);
	table.on('wb-updated.wb-tables', heading);
	});
