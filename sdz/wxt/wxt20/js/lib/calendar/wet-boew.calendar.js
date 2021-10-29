/*Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
	Terms and conditions of use: http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Terms
	Conditions régissant l'utilisation : http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Conditions
*/

/* TODO: 
	*	Replace navaid for the new hiding solution
*/

var calendar = {
	// Used to store localized strings for your plugin.
	dictionary : { 
	        weekDayNames : (PE.language == "eng") ? ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] : ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
	        monthNames : (PE.language == "eng") ? ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] : ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
		currentDay : (PE.language == "eng") ? " (Current Day)" : " (Jour courrant)",
		goToLink :  (PE.language == "eng") ? "Go To..." : "Aller à...",
		goToTitle :  (PE.language == "eng") ? "Go To Month of Year" : "Aller au mois de l'année",
		goToMonth : (PE.language == "eng") ? "Month:" : "Mois : ",
		goToYear : (PE.language == "eng") ? "Year:" : "Année : ",
		goToButton : (PE.language == "eng") ? "Go" : "Aller",
		cancelButton : (PE.language == "eng") ? "Cancel" : "Annuler"
	},
	
	create: function (containerid, year, month, shownav, mindate, maxdate){
		var objCalendar;
		var container = $('#' + containerid);
		
		container.addClass("cal-container");
		container.removeClass("cal-container-extended");
		
		//Converts min and max date from string to date objects
		var minDate = calendar.getDateFromISOString(mindate);
		if (minDate == null){
			minDate = (new Date);
			minDate.setFullYear(year-1, month,1);
		}
		var maxDate = calendar.getDateFromISOString(maxdate);
		if (maxDate == null){
			maxDate = (new Date)
			maxDate.setFullYear(year+1, month,1);
		}
		
		//Validates that the year and month are in the min and max date range
		if (year > maxDate.getFullYear() && month > maxDate.getMonth()){
			year = maxDate.getFullYear();
			month = maxDate.getMonth();
		}else if(year < minDate.getFullYear() && month < minDate.getMonth()){
			year = minDate.getFullYear();
			month = minDate.getMonth()
		}
		
		//Reset calendar if the calendar previously existed
		if(container.children("div#cal-" + containerid +"-cnt").length > 0){
			container.children("div#cal-" + containerid +"-cnt").find("ol#cal-" + containerid +"-weekdays, .cal-month, div#cal-" + containerid +"-days").remove();
			objCalendar = container.children("div#cal-" + containerid +"-cnt");
		}else{
			objCalendar = $("<div id=\"cal-" + containerid +"-cnt\" class=\"cal-cnt\"></div>");
			container.append(objCalendar);
		}
		//Creates the calendar header
		var calHeader 
		if (container.children("div#cal-" + containerid +"-cnt").children(".cal-header").length > 0){
			calHeader = container.children("div#cal-" + containerid +"-cnt").children(".cal-header")
		}else{
			calHeader = $("<div class=\"cal-header\"></div>");
		}
		
		if(shownav)
		{
			//Create the month navigation
			var monthNav = this.createMonthNav(containerid, year, month, minDate, maxDate)
			if ($("#cal-" + containerid + "-monthnav").length < 1)
			{
				calHeader.append(monthNav);
			}
			
			if (container.children("div#cal-" + containerid +"-cnt").children(".cal-header").children(".cal-goto").length < 1)
			{
				//Create the go to form
				calHeader.append(this.createGoToForm(containerid, year, month, minDate, maxDate));
			}
		}
		calHeader.append("<div class=\"cal-month\">" + this.dictionary.monthNames[month] + " " + year + "</div>" );
		objCalendar.append(calHeader);
		
		//Create the calendar body
		
		//Creates weekdays | Cree les jours de la semaines
		objCalendar.append(this.createWeekdays(containerid));
		
		//Creates the rest of the calendar | Cree le reste du calendrier
		var days = this.createDays(containerid, year, month)
		var daysList = days.children("ol.cal-day-list").children("li");
		objCalendar.append(days);
		
		//Trigger the calendarDisplayed Event
		container.trigger('calendarDisplayed', [year, month, daysList]);
	},
	
	createMonthNav : function (calendarid, year, month, minDate, maxDate){
		var monthNav
		if ($("#cal-"+ calendarid +  "-monthnav").length > 0){
			monthNav = $("#cal-"+ calendarid +  "-monthnav");
		}else{
			monthNav = $("<div id=\"cal-" + calendarid +  "-monthnav\"></div>")
		}
		
		//Create month navigation links | Cree les liens de navigations
		for(n=0;n<2;n++){
			var suffix;
			var newMonth;
			var newYear;
			var showButton = true;
			var btnCtn = null;
			var btn = null;
			//Set context for each button
			switch(n){
				case 0:
					suffix = "prevmonth";
					if (month > 0){
						newMonth = month-1;
						newYear = year;
					}else{
						newMonth = 11;
						newYear = year - 1;
					}
					
					if ((newMonth< minDate.getMonth() && newYear <= minDate.getFullYear()) || newYear < minDate.getFullYear()){
						showButton = false;
					}
					break;
				case 1:
					suffix = "nextmonth";
					if (month<11){
						newMonth = month + 1
						newYear = year;
					}else{
						newMonth = 0;
						newYear = year + 1;
					}
					
					if ((newMonth > maxDate.getMonth() && newYear >= maxDate.getFullYear()) || newYear > maxDate.getFullYear()){
						showButton = false;
					}
					break;
			}
			
			if (monthNav.children(".cal-" + suffix).length > 0){
				btnCtn = monthNav.children(".cal-" + suffix);
			}
			if (showButton){
				var title = this.dictionary.monthNames[newMonth] + " " + newYear;
				if (btnCtn){
					btn = btnCtn.children("a")
					btn.children("img").attr("alt", title);
					btn.unbind();
				}else{
					btnCtn = $("<div class=\"cal-" + suffix + "\"></div>");
					btn = $("<a href=\"javascript:;\" role=\"button\"><img src=\"" + Utils.getLibraryPath() + "/calendar/" + suffix.substr(0,1) + ".gif\" alt=\"" + title + "\" /></a>")
					btnCtn.append(btn);
					monthNav.append(btnCtn);
				}
				btn.bind('click', {year: newYear, month : newMonth, mindate: calendar.getISOStringFromDate(minDate), maxdate: calendar.getISOStringFromDate(maxDate)},function(event){
					calendar.create(calendarid, event.data.year, event.data.month, true, event.data.mindate, event.data.maxdate);
					$(this).focus()
				});
			}else{
				if (btnCtn){
					btnCtn.remove();
				}
			}
		}
		return monthNav;
	},
	
	createGoToForm : function (calendarid, year, month, minDate, maxDate){
		var goToForm = $("<div class=\"cal-goto\"></div>");
		var form = $("<form id=\"cal-" + calendarid + "-goto\" role=\"form\" class=\"navaid\"><fieldset><legend>" + this.dictionary.goToTitle + "</legend></fieldset></form>");
		form.submit(function(){calendar.onGoTo(calendarid, minDate, maxDate); return false});
		var fieldset = form.children("fieldset");
		
		//Create the list of month field
		var monthContainer = $("<div class=\"cal-goto-month\"><label for=\"cal-" + calendarid + "-goto-month\">" + this.dictionary.goToMonth + "</label><br /></div>");
		
		var monthField = $("<select id=\"cal-" + calendarid + "-goto-month\"></select>");
		$(this.dictionary.monthNames).each(function(index, value){
			monthField.append("<option" + ((index == month)? " selected=\"selected\"" : "") + ">" + value + "</option>");
		});
		monthField.attr("disabled", true);
		monthField.keyup(function(e) {
			if(e.keyCode == 13) {
				form.submit();
			}
		});
		monthContainer.append(monthField);
		fieldset.append(monthContainer);
		
		//Create the year field
		var yearContainer =$("<div class=\"cal-goto-year\"><label for=\"cal-" + calendarid + "-goto-year\">" + this.dictionary.goToYear + "</label><br /></div>")
		var yearField = $("<select id=\"cal-" + calendarid + "-goto-year\"></select>");
		for(var y=minDate.getFullYear();y<=maxDate.getFullYear();y++){
			yearField.append($('<option value="' + y + '"' + (y == year? ' selected="selected"' : '') + '>' + y+ '</option>'));
		}
		yearField.keyup(function(e) {
			if(e.keyCode == 13) {
				form.submit();
			}
		});
		yearField.attr("disabled", true);
		yearContainer.append(yearField);
		fieldset.append(yearContainer);
		
		var buttonContainer = $("<div class=\"cal-goto-button\"></div>");
		var button = $("<input type=\"submit\" value=\"" + this.dictionary.goToButton + "\" />")
		button.attr("disabled", true);
		buttonContainer.append(button);
		fieldset.append(buttonContainer);
		
		var buttonCancelContainer = $("<div class=\"cal-goto-button\"></div>");
		var buttonCancel = $("<input type=\"button\" value=\"" + this.dictionary.cancelButton + "\" />");
		buttonCancel.click(function(){calendar.hideGoToForm(calendarid)});
		buttonCancel.attr("disabled", true);
		buttonCancelContainer.append(buttonCancel);
		fieldset.append(buttonCancelContainer);
		
		var goToLinkContainer = $("<p class=\"cal-goto-link\" id=\"cal-" + calendarid + "-goto-link\"></p>");
		var goToLink = $("<a href=\"#cal-" + calendarid + "-goto\" role=\"button\" aria-controls=\"cal-" + calendarid + "-goto\" aria-expanded=\"false\">" + this.dictionary.goToLink + "</a>");
		goToLink.click(function(){calendar.showGoToForm(calendarid);})
		goToLinkContainer.append(goToLink);
		
		goToForm.append(goToLinkContainer);
		goToForm.append(form);
		
		return goToForm;
	},
	
	createWeekdays : function(calendarid){
		var weekdays = $("<ol id=\"cal-" + calendarid +"-weekdays\" class=\"cal-weekdays\" role=\"presentation\"></ol>")
		for (var wd=0;wd<7;wd++)
		{
			var txt = this.dictionary.weekDayNames[wd]
			var wday = $("<li id=\"cal-" + calendarid +"-wd" + (wd + 1) + "\" class=\"cal-wd" + (wd + 1) + "\"><abbr title=\"" + txt + "\">" + txt.substr(0,1) + "</abbr></li>")
			if(wd == 0 || wd == 6){
				wday.addClass = "we";
			}
			weekdays.append(wday);
		}
		
		return weekdays
	},
	
	createDays : function(calendarid, year, month){
		var cells = $("<div id=\"cal-" + calendarid +"-days\" class=\"cal-days\"></div>")
		var days = $("<ol id=\"cal-" + calendarid +"-" + month + "_" + year + "\" class=\"cal-day-list\"></ol>")
		
		var date = (new Date);
		//Get the day of the week of the first day of the month | Determine le jour de la semaine du premier jour du mois
		date.setFullYear(year,month,1);
		var firstday = date.getDay();

		//Get the last day of the month | Determine le dernier jour du mois
		date.setFullYear(year, month + 1, 0);
		var lastday = date.getDate()-1;
		
		//Get the current date
		date = (new Date);
		date.getDate();
		
		var daycount = 0;
		var breakAtEnd=false;
		
		for (var week=1;week<7;week++){
			for (var day=0;day<7;day++){
				var element;
				var elementParent;
				if ((week == 1 && day<firstday) || (daycount>lastday)){
					//Creates empty cells | Cree les cellules vides
					element = $("<span class=\"cal-empty\">" + String.fromCharCode(160) + "</span>");
					elementParent = cells;
				}else{
					//Creates date cells | Cree les cellules de date
					daycount++;
					var isCurrentDate = (daycount == date.getDate() && month == date.getMonth() && year == date.getFullYear());
					
					if (daycount == 1){cells.append(days);}
					if (daycount > lastday){breakAtEnd = true;}
					element = $("<li></li>");
					
					var child = $("<div></div>")
					
					if (PE.language == 'eng'){
						var suffix = ""
						if(daycount>10 && daycount <20){
							suffix="th";
						}else{
							switch(daycount%10){
								case 1:
									suffix="st";
									break;
								case 2:
									suffix="nd";
									break;
								case 3:
									suffix="rd";
									break;
								default:
									suffix="th";
							}
						}
						child.append("<span class=\"navaid\">" + this.dictionary.weekDayNames[day] + " " + this.dictionary.monthNames[month] + " </span>" + daycount + "<span class=\"navaid\">" + suffix + " " + year + ((isCurrentDate)? this.dictionary.currentDay : "") + "</span>");
					}else if (PE.language == 'fra'){
						child.append("<span class=\"navaid\">" + this.dictionary.weekDayNames[day]  + " </span>" + daycount + "<span class=\"navaid\"> " + this.dictionary.monthNames[month].toLowerCase() +  " " + year + ((isCurrentDate)? this.dictionary.currentDay : "") + "</span>");
					}
					element.append(child);
					elementParent = days;
				}
				element.attr("id", "cal-" + calendarid +"-w" + week + "d" + (day+1));
				element.addClass("cal-w" + week + "d" + (day+1));
				if(day == 0 || day == 6){
					element.addClass("cal-we")
				}
				if (isCurrentDate){
					element.addClass("cal-currentday")
				}
				elementParent.append(element);
			}
			if (breakAtEnd){break;}
		}
		
		return cells;
	},
	
	showGoToForm : function(calendarid){
		var link = $("#cal-" + calendarid + "-goto-link");
		var form = $("#cal-" + calendarid + "-goto");
		
		link.addClass("navaid");
		link.children("a").attr("aria-hidden","true");
		link.children("a").attr("aria-expanded","true");
		form.removeClass("navaid"); 
		$("#" + calendarid).addClass("cal-container-extended");
			
		//Enable the form fields
		form.find(".cal-goto-month select, .cal-goto-year select, .cal-goto-button input").attr("disabled", false);
			
		//Hide the month navigation
		$("#cal-" + calendarid +  "-monthnav").children(".cal-prevmonth, .cal-nextmonth").addClass("navaid");
		$("#cal-" + calendarid +  "-monthnav").children(".cal-prevmonth, .cal-nextmonth").children("a").attr("aria-hidden", "true");
	},
	
	hideGoToForm : function(calendarid){
		var link = $("#cal-" + calendarid + "-goto-link");
		var form = $("#cal-" + calendarid + "-goto");
		
		link.removeClass("navaid");
		link.children("a").attr("aria-hidden","false");
		link.children("a").attr("aria-expanded","false");
		form.addClass("navaid");
		$("#" + calendarid).removeClass("cal-container-extended");
			
		//Disable form field
		form.find(".cal-goto-month select, .cal-goto-year select, .cal-goto-button input").attr("disabled", true);
			
		//Show the month navigation
		$("#cal-" + calendarid +  "-monthnav").children(".cal-prevmonth, .cal-nextmonth").removeClass("navaid");
		$("#cal-" + calendarid +  "-monthnav").children(".cal-prevmonth, .cal-nextmonth").children("a").attr("aria-hidden", "false");

	},
	
	onGoTo : function(calendarid, minDate, maxDate){
		var container = $("#" + calendarid);
		
		var fieldset = container.find("fieldset");
		var month = fieldset.find(".cal-goto-month select option:selected").index();
		var year = parseInt(fieldset.find(".cal-goto-year select").attr("value"));
		
		if(!(month< minDate.getMonth() && year <= minDate.getFullYear()) && !(month > maxDate.getMonth() && year >= maxDate.getFullYear())){
			calendar.create(calendarid, year, month, true, calendar.getISOStringFromDate(minDate), calendar.getISOStringFromDate(maxDate));
			calendar.hideGoToForm(calendarid);
		}
	},
	
	getDateFromISOString : function(strdate){
		var date = null;
		
		if(strdate){
			if (strdate.match(/\d{4}-\d{2}-\d{2}/)){
				var date = (new Date);
				date.setFullYear(strdate.substr(0,4), strdate.substr(5,2)-1,  strdate.substr(8,2)-1)
			}
			
			return date;
		}
		return null;
	},
	
	getISOStringFromDate : function(date){
		return date.getFullYear() + '-' + this.strPad(date.getMonth() + 1,2,'0') + '-' + this.strPad(date.getDate() + 1, 2, '0');
	},
	
	strPad : function(i,l,s) {
		var o = i.toString();
		if (!s) { s = '0'; }
		while (o.length < l) {
			o = s + o;
		}
		return o;
	}
}

// Add Style Sheet Support for this plug-in
Utils.addCSSSupportFile(Utils.getLibraryPath() + "/calendar/cal-base.css");
Utils.addCSSSupportFile(Utils.getLibraryPath() + "/calendar/cal-theme.css");
