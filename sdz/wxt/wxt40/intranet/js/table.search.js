
$(".wb-tables").on("preInit.dt", function (event) {
        var searchText = getUrlParam("Search");
        var table = $("#table-query").DataTable();
        table.search(searchText);
    });
	 var getUrlParam = function getUrlParam(sParam) {
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
	

	