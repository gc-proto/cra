/*this function allows the table to be searched by keywords queried by the URL */
$(".wb-tables").on("preInit.dt", function () {
	"use strict";
	// Retrieve query value in URL
	var query = getQueryParams(document.location.search);

	// If value have been passed in URL = Process
	if (query) {

		
		var ttSearch = getUrlParam2('ttsrch');
		document.getElementById(ttSearch).checked = true;
		

		// For each dropdown check if value has been passed
		Object.keys(query).forEach(function (key) {
			$("#" + key).val(query[key]);
		//Submit form filter first
		$("form.wb-tables-filter").submit();	
		});


		var table = $("#table-query").DataTable();
		// When the dropdown filter are applied, apply the Search sentence to table

		//Remove quotes from search term
		table.search();
		//Filter by search keyword 	
		var searchText = getUrlParam("Search");
		table.search(searchText);


	}

});
var getUrlParam = function getUrlParam(sParam) {
	"use strict";
	var sPageURL = decodeURIComponent(window.location.search.substring(1)),
		sURLVariables = sPageURL.split('&'),
		sParameterName,
		i;

	for (i = 0; i < sURLVariables.length; i++) {
		sParameterName = sURLVariables[i].split('=');

		if (sParameterName[0] === sParam) {
			return sParameterName[1] === undefined ? true : ('"' + sParameterName[1] + '"');
		}
	}
};

var getUrlParam2 = function getUrlParam(sParam) {
	"use strict";
	var sPageURL = decodeURIComponent(window.location.search.substring(1)),
		sURLVariables = sPageURL.split('&'),
		sParameterName,
		i;

	for (i = 0; i < sURLVariables.length; i++) {
		sParameterName = sURLVariables[i].split('=');

		if (sParameterName[0] === sParam) {
			return sParameterName[1] === undefined ? true : (sParameterName[1]);
		}
	}
};


/* This function retrieves id and value of dropdown filter in the URL */
function getQueryParams(urlWithQuery) {
	"use strict";
	var tokens;
	var params = {};
	var regex = /[?&]?([^=]+)=([^&]*)/g;
	var queryString = urlWithQuery.split("+").join(" ");

	while ((tokens = regex.exec(queryString)) !== null) {
		params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
	}

	return params;
}