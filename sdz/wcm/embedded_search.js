function findSearch(languageString) {
    "use strict";
    var url = window.location.href;
    var searchFilename = "search-" + languageString + ".htm";
    
    if (url.toLowerCase().indexOf("/english/") > -1 || url.toLowerCase().indexOf("/francais/") > -1) {
        work (url, searchFilename)
    } else {
        // get replacement
        checkForFriendly(url, searchFilename);
    }
    
	$("#customsearch").submit(function(event) {
		$(":input").each(function(i, field) {
			if(field.name == "searchchoices") {
				var searchesJSON = eval ("(" + field.value + ")");
				$("#customsearch").attr("action", searchesJSON[0]);
				document.getElementById("searchIndex").value = searchesJSON[2];
				document.getElementById("searchClient").value = searchesJSON[1];
				$("#searchchoices").remove();
			}
		});
	});
}

function checkForFriendly (url, searchFilename) {
    
    var requestUrl;
    var dbServer;
    var serverMap = {
        "sh0lqitvap239": "sh0lqitvap239",
        "sh0lqitvap240": "sh0lqitvap240",
        "sh0lqitvap241": "7.28.108.148",
        "sh0lqitvap242": "icms-scgi-si.isvcs.net",
        "sh0lqitvap243": "sh0lqitvap243",
        "sh0lqitvap244": "sh0lqitvap244",
        "icms-scgi-ut.isvcs.net": "icms-scgi-ut.isvcs.net",
        "icms-scgi-ot.isvcs.net": "icms-scgi-ot.isvcs.net",
        "workzone": "icms-scgi.isvcs.net",
        "staging": "icms-scgi.isvcs.net",
        "infozone": "icms-scgi.isvcs.net"
    };

    var hostname = document.location.hostname;
    var port = document.location.port;
    if (hostname === "sh0lqitvap242" && (port === "82" || port === "83" || port === "84")) {
        dbServer = hostname;
    } else {
        dbServer = serverMap[hostname];
    }
    if (dbServer === null || dbServer === undefined || dbServer.trim() === "") {
        dbServer = "icms-scgi-si.isvcs.net";
    }

    requestUrl = "http://" + dbServer + "/iw-cc/rest/ts/getFriendlyEquivalent?callback=friendlyCallback&url=" + encodeURIComponent(url) + "&" + "searchFilename=" + searchFilename;

    $.ajax({
        type: "GET",
        url: requestUrl,
        dataType: "jsonp"
    });

}

function friendlyCallback(data) {
    "use strict";
    work (data.url, data.searchFilename);
}

function work(url, searchFilename) {
    "use strict";
    var pattern = new RegExp("(^http://.*?)(/.*)/.*");
    var rubiconPattern = new RegExp(/\/WORKAREA\/content\/htdocs$/);
    var search = "";
    var resultUrl = pattern.exec(url);
    var found = false;

    while(resultUrl != null) {
        url = resultUrl[1] + resultUrl[2];
        search = resultUrl[2] + "/" + searchFilename;
        
        $.ajax({
            url: search,
            async: false,
            success: function (result) {
                $("#em-search").html(result);
                found = true;
            }
        });
    
        /**
         * Did we find search-X.htm? If so, break out.
         */
        if (found == true){
            break;
        }
    
        resultUrl = pattern.exec(url);
        /**
         * Determine if we're traversing outside of the workarea. If so, break out.
         * If we were to continue, IWPROXY_PATHTRACK would trigger and have an invalid
         * path for the remaining HTTP requests. (i.e. Breaking CKEditor)
         */
        if (resultUrl != null && resultUrl[2].match(rubiconPattern)) {
            break;
        }
    }
}
