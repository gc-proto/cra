$(document).ready(function(){
	
	// Find the object with an id of "emailButton".
	$("#emailButton").click(function(e) {
		var nowTime = Date.now(); // Get the current time in milliseconds since the epoch
		
		var hrefValue = $(this).attr("href");
		if (hrefValue.indexOf("?subject=") == -1) // there's no subject for the email
		{
			// Add a subject to the href and append the current time as a unique identifier
			e.originalEvent.currentTarget.href = hrefValue + "?subject=Service%20Request%20-%20" + nowTime;
		}
		else
		{
			// Append to the href the current time as a unique identifier
			e.originalEvent.currentTarget.href = hrefValue + "%20-%20" + nowTime;
		}
		
	});
	
});