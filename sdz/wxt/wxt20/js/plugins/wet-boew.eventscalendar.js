/*Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
	Terms and conditions of use: http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Terms
	Conditions régissant l'utilisation : http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Conditions
*/

var eventsCalendar= {
	params :  Utils.loadParamsFromScriptID("eventscalendar"),
	
	init : function(){
		var date = (new Date);
		var year = date.getFullYear();
		var month = date.getMonth();
		
		var selectors = eval(decodeURIComponent(this.params.selectors));
		$(selectors).each(function(index, value){
			if(value.hideEvents || value.hideEvents == 'true' ||  value.hideEvents == 1 ||  value.hideEvents == '1'){
				$("#" + value.eventsid).find("ol").addClass("navaid");
			}
			if (value.year && value.month){
				year = value.year;
				month = value.month - 1;
			}
			
			var events = eventsCalendar.getEvents(value.eventsid);
			$("#" + value.containerid).bind("calendarDisplayed", function(e, year, month, days){
				eventsCalendar.addEvents(year, month, days, value.containerid, events.list);
			});
			calendar.create(value.containerid, year, month, true, calendar.getISOStringFromDate(events.minDate), calendar.getISOStringFromDate(events.maxDate));
		});
		
	},
	
	getEvents :  function(idEventsList){
		var events={minDate:null, maxDate:null, list:[{a:1}]};
		
		var objEventsList = null;
		
		if ($("#" + idEventsList + " ol").length > 0){
			objEventsList = $("#" + idEventsList + " ol");
		}else if ($("#" + idEventsList + " ul").length > 0){
			objEventsList = $("#" + idEventsList + " ul");
		}
		
		if (objEventsList != null){
			objEventsList.children("li").each(function(e){
				var event = $(this);
				var title = event.children("*:header:first").text();
				var link = event.find("a").attr("href");
				var strDate = event.children("*").children("time").attr("datetime");
				strDate = strDate.substr(0, 10);
				var d = strDate.split("-");
				var date = (new Date);
				date.setFullYear(d[0],d[1] - 1,d[2]);
				
				if (events.minDate == null || date < events.minDate){events.minDate = date;}
				if (events.maxDate == null || date > events.maxDate){events.maxDate = date;}
				
				events.list[e] = {"title" : title, "date" : date, "href" : link};
			});
		}
		return events
	},
	
	addEvents : function(year, month, days, containerid, eventslist){
		var container = $("#" + containerid);
		
		//Fix required to make up with the IE z-index behavior mismatch
		days.each(function(index, day){
			$(day).css("z-index", 31-index)
			$(day).css("z-index", 31-index)
		});
		
		//Determines for each event, if it occurs in the display month
		$(eventslist).each(function(e){
			var date = new Date(eventslist[e].date);
			
			var day = $(days[date.getDate()-1]);
			
			if (date.getMonth() == month && date.getFullYear() == year)
			{
				//Gets the day cell to display an event
				var content = day.children("div").html();
				
				var dayEvents
				if (day.children("a").length < 1){
					day.empty();
					var link = $("<a href=\"#ev-" + day.attr("id") +  "\" class=\"calEvent\">" + content + "</a>")
					day.append(link);
					dayEvents = $("<ul class=\"navaid\"></ul>")
					
					//Show day events on mouse over
					day.bind("mouseover", {details: dayEvents}, function(event){
						event.data.details.dequeue();
						event.data.details.removeClass("navaid")
						event.data.details.addClass("ev-details");
					});
					
					//Hide days events on mouse out
					day.bind("mouseout", {details: dayEvents}, function(event){
						event.data.details.delay(1000).queue(function(){
							$(this).removeClass("ev-details");
							$(this).addClass("navaid");
							$(this).dequeue();
						});
					});
					
					//Show day events when tabbing in
					link.bind("focus", {details: dayEvents}, function(event){
						event.data.details.removeClass("navaid");
						event.data.details.addClass("ev-details");
					});
					//hide day events when tabbing out
					link.bind("blur", {details: dayEvents}, function(event){
						event.data.details.removeClass("ev-details");
						event.data.details.addClass("navaid");
					});
					
					day.append(dayEvents)
				}else{
					dayEvents = day.children("ul")
				}
				
				var eventDetails = $("<li><a href=\"" + eventslist[e].href +  "\">" + eventslist[e].title + "</a></li>");
				dayEvents.append(eventDetails);
				
				var link = eventDetails.children("a");
				
				//Hide day events when the last event for the day loose focus
				link.bind("blur", {details: dayEvents}, function(event){
					event.data.details.removeClass("ev-details");
					event.data.details.addClass("navaid");
				});
				
				//Show day events when tabbing in
				link.bind("focus", {details: dayEvents}, function(event){
						event.data.details.removeClass("navaid");
						event.data.details.addClass("ev-details");
				});
			}
		});
	}
}

// Add Style Sheet Support for this plug-in
Utils.addCSSSupportFile(Utils.getSupportPath() + "/eventscalendar/styles.css");

// Loads a library that the plugin depends on from the lib folder
PE.load('calendar/wet-boew.calendar.js');

$("document").ready(function(){   eventsCalendar.init(); });