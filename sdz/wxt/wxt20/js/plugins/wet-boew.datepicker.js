/*Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
	Terms and conditions of use: http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Terms
	Conditions régissant l'utilisation : http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Conditions
*/

var datepicker = {
	// Load the parameters used in the plugin declaration. Parameters can be access using this.parms.parameterName
	params :  Utils.loadParamsFromScriptID("datepicker"),
	
	defaultFormat : "YYYY-MM-DD",
	
	// Used to store localized strings for your plugin.
	dictionary : { 
		hideText : (PE.language == "eng") ? "Hide Calendar" : "Masquer le calendrier",
	       showText : (PE.language == "eng") ?  "Pick a date from a calendar for field: " : "Sélectionner une date à partir d'un calendrier pour le champ : "
	},
	
	// Method that is executed when the page loads
	init : function(){
		var containerid = this.params.containerid
		
		var date = (new Date);
		var year = date.getFullYear();
		var month = date.getMonth();
		
		var minDate = calendar.getDateFromISOString(this.params.minDate);
		if(minDate == null){
			minDate = calendar.getDateFromISOString('1800-01-01');
		}
		var maxDate = calendar.getDateFromISOString(this.params.maxDate);
		if(maxDate == null){
			maxDate =  calendar.getDateFromISOString('2100-01-01');
		}
		
		if (this.params.year && this.params.month){
			year = this.params.year;
			month = this.params.month - 1;
		}
		
		if (this.params.closeOnSelect == null){this.params.closeOnSelect = true;}
		
		$(this.params.selector).each(function(index, value){
			if($(this).attr("id")){
				var id = $(this).attr("id")
				var field = $(this);
				var containerid = id + '-picker'
				var container = $('<div id="' + containerid + '" role="dialog" aria-controls="' + id + '" aria-labelledby="' + containerid +'-toggle"></div>');
				field.after(container)
				
				container.bind("calendarDisplayed", function(e, year,  month, days){datepicker.addLinksToCalendar(id, year, month, days, minDate, maxDate);datepicker.setSelectedDate(id, year, month, days)});
				calendar.create(containerid, year, month, true, datepicker.params.minDate, datepicker.params.maxDate); 
				datepicker.createToggleIcon(id, containerid);
				
				//Disable the tabbing of all the links when calendar is hidden
				container.find("a").attr("tabindex", -1);

				//Resize the form element to fit a standard date
				field.addClass("picker-field");
			}
		});
		
		//Set overlay display when applicable
		if (this.params.overlay != false && this.params.overlay != 'false'){
			$(".cal-container").addClass("picker-overlay")
			$(".cal-container").attr("aria-hidden","true").hide();
		}
	},
	
	addLinksToCalendar : function(fieldid,year, month, days, minDate, maxDate){
		var lLimit = (year == minDate.getFullYear() && month == minDate.getMonth())? true : false;
		var hLimit = (year == maxDate.getFullYear() && month == maxDate.getMonth())? true : false;

		days.each(function(index, value){
			if ((!lLimit && !hLimit) || (lLimit == true && index >= minDate.getDate()) || (hLimit == true && index <= maxDate.getDate())){
				var obj = $(value).children("div");
				var link = $("<a href=\"javascript:;\"></a>");
				var parent = obj.parent()
				parent.empty();
				link.append(obj.html());
				link.appendTo(parent);
				link.bind('click', {fieldid: fieldid, year: year, month : month, day: index + 1, days:days}, 
					function(event){
						datepicker.addSelectedDateToField(event.data.fieldid, event.data.year, event.data.month+1, event.data.day); 
						datepicker.setSelectedDate(event.data.fieldid, event.data.year, event.data.month, event.data.days);
						//Hide the calendar on selection
						if (datepicker.params.closeOnSelect != false && datepicker.params.closeOnSelect != 'false'){
							datepicker.toggle(event.data.fieldid , event.data.fieldid + "-picker");
						}
					}
				);
			}
		});

	},
	
	createToggleIcon : function(fieldid, containerid){
		var fieldLabel = $("label[for='" + fieldid + "']").text()
		objToggle = $('<div id="' + containerid +'-toggle" class="picker-toggle-hidden"><a href="javascript:;"><img src="' + Utils.getSupportPath() + "/datepicker/icon.png"+ '" alt="' + this.dictionary.showText + fieldLabel + '"/></a></div>');
		objToggle.children("a").click(function(){datepicker.toggle(fieldid, containerid);})
		var field = $('#' + fieldid);
		field.after(objToggle);
		
		var container = $('#' + containerid);
		container.slideUp(0);
	},
	
	setSelectedDate : function(fieldid, year, month, days){
		//Reset selection state
		$(days).removeClass("datepicker-selected");
		
		//Create regular expression to match value (Note: Using a, b and c to avoid replacing conflicts)
		var format = (this.params.format && this.params.format!= '') ? this.params.format : this.defaultFormat;
		format = format.replace("DD", "(?<a> [0-9]{2})");
		format = format.replace("D", "(?<a> [0-9] )");
		format = format.replace("MM", "(?<b> [0-9]{2})");
		format = format.replace("M", "(?<b> [0-9])");
		format = format.replace("YYYY", "(?<c> [0-9]{4})");
		format = format.replace("YY", "(?<c> [0-9]{2})");
		var pattern = "^" + format + "$";
		
		//Get the date from the field
		var date = $("#" + fieldid).attr("value");
		regex = XRegExp(pattern, "x");
		try{
			if (date != '')
			{
				var cpntDate =  $.parseJSON(date.replace(regex, '{"year":"${c}", "month":"${b}", "day":"${a}"}'));
				if (cpntDate.year == year && cpntDate.month== month+1){
					$(days[parseInt(cpntDate.day) - 1]).addClass("datepicker-selected");
				}
			}
		}catch(e){

		}
	},
		
	addSelectedDateToField : function (fieldid, year, month, day){
		$("#" + fieldid).attr("value", this.formatDate(year, month, day));
	},

	toggle : function (fieldid, containerid){
		var toggle = $("#" + containerid + "-toggle");
		toggle.toggleClass("picker-toggle-hidden picker-toggle-visible");
		var container = $('#' + containerid);
		
		container.unbind("focusout.calendar");
		container.unbind("focusin.calendar");
		
		if(toggle.hasClass("picker-toggle-visible")){
			//Hide all other calendars
			datepicker.hideAll(fieldid);
			
			//Enable the tabbing of all the links when calendar is visible
			container.find("a").attr("tabindex", 0);
			container.slideDown('fast');
			container.attr("aria-hidden","false");
			toggle.children("a").children("span").text(datepicker.dictionary.hideText);
		}else{
			//Disable the tabbing of all the links when calendar is hidden
			container.find("a").attr("tabindex", -1);
			container.slideUp('fast');
			calendar.hideGoToForm(containerid);
			var fieldLabel = $("label[for='" + fieldid + "']").text()
			toggle.children("a").children("span").text(datepicker.dictionary.showText + fieldLabel);
			container.attr("aria-hidden","true");
		}
	},
	
	hideAll : function(exception){
		$(datepicker.params.selector).each(function(index, value){
			if($(this).attr("id") != exception){
				var fieldid = $(this).attr("id")
				var containerid =  fieldid+ '-picker';
				var container = $("#" + containerid);
				var toggle = $("#" + containerid + "-toggle");
				
				//Disable the tabbing of all the links when calendar is hidden
				container.find("a").attr("tabindex", -1);
				container.slideUp('fast');
				container.attr("aria-hidden","true");
				calendar.hideGoToForm(containerid);
				var fieldLabel = $("label[for='" + fieldid + "']").text()
				toggle.children("a").children("span").text(datepicker.dictionary.showText + fieldLabel);
				toggle.removeClass("picker-toggle-visible");
				toggle.addClass("picker-toggle-hidden");
			}
		});
	},
		
	formatDate : function (year, month, day){
		var output = (this.params.format && this.params.format!= '') ? this.params.format : this.defaultFormat;
		output = output.replace("DD", calendar.strPad(day, 2, '0'));
		output = output.replace("D", day);
		output = output.replace("MM", calendar.strPad(month, 2, '0'));
		output = output.replace("M", month);
		output = output.replace("YYYY", year);
		output = output.replace("YY", year.toString().substr(2,2));
		
		return output
	}
}

// Add Style Sheet Support for this plug-in
Utils.addCSSSupportFile(Utils.getSupportPath() + "/datepicker/styles.css");

// Loads a library that the plugin depends on from the lib folder
PE.load('calendar/wet-boew.calendar.js');
PE.load('xregexp.js');


// Init Call at Runtime
$("document").ready(function(){   datepicker.init(); });