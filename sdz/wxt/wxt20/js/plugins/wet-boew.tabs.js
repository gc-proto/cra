/* Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
Terms and conditions of use: http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Terms
Conditions régissant l'utilisation : http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Conditions */
/**
 * Tabs plugin
 * @author Dave Schindler (sorry for the huge mess of uncommented code. I will add comments as soon as I figure out what code will stay)
 * @author Paul Jackson
 */
(function($) {
	var debugMode = false, log;
	if (debugMode && window.console && window.console.log) {
		log = window.console.log;
	} else {
		log = function() {};
	}
	
	$.fn.tabs = function(opts) {
		return this.each(function(i) {
			var $this = $(this);
			var $nav = $this.find("ul:first");
			var $tabs = $('li > a', $nav);
			var $panels = $('.tabs-panel', this).children();
			// WAI-ARIA accessibility features
			$nav.attr("role", "tablist");
			$('li', $nav).each(function() {
				$(this).attr("role", "presentation");
				$(this).children('a').each(function() {
					$(this).attr("role", "tab").attr("aria-selected","false").attr("id",$(this).attr("href").substring(1) + "-link").bind('click', function(evt){
						$(this).parent().parent().children('.active').children('a').each(function() {
							$(this).attr("aria-selected","false");
							$('#'+$(this).attr("href").substring(1)).attr("aria-hidden","true");
						});
						$(this).attr("aria-selected","true");
						$('#'+$(this).attr("href").substring(1)).attr("aria-hidden","false");						
					});
				});
			});
			$panels.each(function() {$(this).attr("role", "tabpanel").attr("aria-hidden", "true").attr("aria-labelledby", $('a[href*="#'+$(this).attr("id")+'"]').attr("id"))});
			$(opts.defaultTab, $nav).children('a').each(function() {
				$(this).attr("aria-selected","true");
				$('#'+$(this).attr("href").substring(1)).attr("aria-hidden","false");
			});
			
			// Allows for keyboard support
			$(this).bind('keydown', 'ctrl+left ctrl+up', function(evt){
				selectPrev($tabs, $panels, opts);
				evt.stopPropagation ? evt.stopImmediatePropagation() : evt.cancelBubble = true;
			});
			$(this).bind('keydown', 'ctrl+right ctrl+down', function(evt){
				selectNext($tabs, $panels, opts);
				evt.stopPropagation ? evt.stopImmediatePropagation() : evt.cancelBubble = true;
			});
			// selects on focus, so that users can tab through the nav list, and the panels react.
			$('li a', $nav).bind('focus', function() {$(this).click();});
			// lets the user move from the tab to the corresponding panel by pressing enter or spacebar on the tab
			$('li a', $nav).bind('keydown', function(e) {
				if (e.keyCode == 13 || e.keyCode == 32) {
					var $current = getCurrentPanel($panels);
					$current.attr('tabindex','0');
					// setTimeout so that JAWS doesn't ignore the .focus() on a usually non-focusable element.
					setTimeout(function(){$current.focus();},0);
				}
			});
			
			var getCurrentTab = function($tabs) {
				return $tabs.filter(function() {
					if ($(this).is('.active')) {
						return true;
					}
					return false;
				});
			};
			
			var getCurrentPanel = function($panels) {
				return $panels.filter(function() {
					if ($(this).is('.active')) {
						return true;
					}
					return false;
				});
			};
			
			var selectPrev = function($tabs, $panels, opts, keepFocus) {
				var $current = getCurrentTab($tabs);
				var $prev = $tabs.eq( (($tabs.index($current) - 1) + $tabs.size()) % $tabs.size());
				if (opts.animate) {
					$panels.filter("." + opts.panelActiveClass).removeClass(opts.panelActiveClass).attr("aria-hidden","true").fadeOut(opts.animationSpeed, function(){$panels.filter("#" + $next.attr("href").substr(1)).fadeIn(opts.animationSpeed, function(){ $(this).addClass(opts.panelActiveClass).attr("aria-hidden","false");});});
				} else {
					$panels.removeClass(opts.panelActiveClass).attr("aria-hidden","true").hide();
					$panels.filter("#" + $prev.attr("href").substr(1)).show().addClass(opts.panelActiveClass).attr("aria-hidden","false");
				}
				$tabs.parent().removeClass(opts.tabActiveClass).children().removeClass(opts.tabActiveClass).filter('a').attr("aria-selected","false");
				$prev.parent().addClass(opts.tabActiveClass).children().addClass(opts.tabActiveClass).filter('a').attr("aria-selected","true");
				var cycleButton = $current.parent().siblings('.tabs-toggle');
				if (!keepFocus && (cycleButton.length === 0 || cycleButton.data("state") === "stopped")) {$prev.focus();}
			};
			
			var selectNext = function($tabs, $panels, opts, keepFocus) {
				var $current = getCurrentTab($tabs);
				var $next = $tabs.eq(($tabs.index($current) + 1) % $tabs.size());
				if (opts.animate) {
					$panels.filter("." + opts.panelActiveClass).removeClass(opts.panelActiveClass).attr("aria-hidden","true").fadeOut(opts.animationSpeed, function(){$panels.filter("#" + $next.attr("href").substr(1)).fadeIn(opts.animationSpeed, function(){ $(this).addClass(opts.panelActiveClass).attr("aria-hidden","false");});});
				} else {
					$panels.removeClass(opts.panelActiveClass).attr("aria-hidden","true").hide();
					$panels.filter("#" + $next.attr("href").substr(1)).show().addClass(opts.panelActiveClass).attr("aria-hidden","false");
				}
				$tabs.parent().removeClass(opts.tabActiveClass).children().removeClass(opts.tabActiveClass).filter('a').attr("aria-selected","false");
				$next.parent().addClass(opts.tabActiveClass).children().addClass(opts.tabActiveClass).filter('a').attr("aria-selected","true");
				var cycleButton = $current.parent().siblings('.tabs-toggle');
				if (!keepFocus && (cycleButton.length === 0 || cycleButton.data("state") === "stopped")) {$next.focus();}
			};
			
			if (opts.autoHeight) {
     		 $panels.show();
     		 $('.tabs-panel', $this).equalHeights(true);
   			}

			
			// most of the heavy lifting is done by EasyTabs...
			$this.easyTabs({"animate":opts.animate, "panelActiveClass":opts.panelActiveClass, "tabActiveClass":opts.tabActiveClass, "defaultTab":opts.defaultTab, "animationSpeed":opts.animationSpeed, "tabs":opts.tabs, "updateHash":opts.updateHash, "cycle":false});
			
			// ...except for cycling, because easyTabs' cycle feature is buggy when there are multiple instances per page...and it's missing some nice features.
			if (opts.cycle) {
				var cycle = function($tabs, $panels, opts) {
					var $current = getCurrentTab($tabs);
					var $pbar = $current.siblings('.tabs-roller');
					$('.tabs-toggle', opts.tabSelector).data('state', 'started');
					$pbar.show().animate({"width":$current.parent().width()}, opts.cycle-200, "linear", function() {
						$(this).width(0).hide();
						selectNext($tabs, $panels, opts, true);
						$(opts.tabSelector).data('interval', setTimeout(function(){cycle($tabs, $panels, opts);}, 0));
					});
				};
				var stopCycle = function(opts) {
					clearTimeout($(opts.tabSelector).data('interval'));
					$('.tabs-roller', opts.tabSelector).width(0).hide().stop();
					$('.tabs-toggle', opts.tabSelector).data('state', 'stopped');
					$toggleButton.html(start);
				};
				
				// creates a play/pause button, and lets the user toggle the state
				var $toggleButton = $("<li class='tabs-toggle'>");
				var stop = (PE.language==="eng" ? "<a class='tabs-stop' href='javascript://'>Pause<span class='cn-invisible'>: Stop tab rotation</span></a>" : "<a class='tabs-stop'>Pause<span class='cn-invisible'> : ArrÃªter la rotation d'onglets</span></a>");
				var start = (PE.language==="eng" ? "<a class='tabs-start' href='javascript://'>Play<span class='cn-invisible'>: Start tab rotation</span></a>" : "<a class='tabs-start'>Jouer<span class='cn-invisible'> : Lancer la rotation d'onglets</span></a>");
				$nav.append($toggleButton.html(stop));
				// handler for $toggleButton clicks
				var toggleCycle = function() {
					if ($toggleButton.data("state") === "stopped") {
						selectNext($tabs, $panels, opts, true);
						cycle($tabs, $panels, opts);
						$toggleButton.html(stop);
					} else if ($toggleButton.data("state") === "started") {
						stopCycle(opts);
					}
				};
				// lets the user pause cycling by clicking on the start/stop button
				$toggleButton.click(toggleCycle).bind("keydown", function(e) {
					if (e.keyCode == 13 || e.keyCode == 32) {
						toggleCycle();
					}
				});
				// also stop cycling if the user clicks on a tab
				$('li a', $nav).not($('a', $toggleButton)).click(function() {
					stopCycle(opts);
				});
				// Sliding progress bar setup
				$tabs.each(function(){
					var $pbar = $('<div class="tabs-roller">').hide().click(function(){
						// let clicks pass through
						$(this).siblings('a').click();
					}).hover(function(){
						$(this).css("cursor", "text");
					});
					if ($.browser.msie && $.browser.version < 8) {
						$(".tabs-style-2 .tabs, .tabs-style-2 .tabs li").css("filter", "");
					}
					$(this).parent().append($pbar);
				});
				
				// okay, we're set up, so start cycling
				cycle($tabs, $panels, opts);
			} // end of cycle code
		});
	};
	
	Utils.addCSSSupportFile(Utils.getSupportPath()+"/tabs/style.css");
	Utils.addIECSSSupportFile(Utils.getSupportPath()+"/tabs/styleIE6.css", 6);
	Utils.addIECSSSupportFile(Utils.getSupportPath()+"/tabs/styleIE7.css", 7);
	PE.load('tabs/hashchange.js');
	PE.load('tabs/easyTabs.js');

	$.fn.tabs.defaults = {"tabSelector":"#tab-container", "animate": false, "panelActiveClass": "active", "tabActiveClass": "active", "defaultTab": "li:first-child", "animationSpeed": "fast", "tabs": "> ul > li", "updateHash": false, "cycle": false, "autoHeight": false};
	$(document).ready(function() {
		var opts = {};
		var params = Utils.loadParamsFromScriptID("tabs");
		if (params.tabs) {
			params = eval(decodeURIComponent(Utils.loadParamsFromScriptID("tabs").tabs));
			if (typeof params === "object" && params.length) {
				var i;
				for (i = 0; i < params.length; i++) {
					opts = $.extend({}, $.fn.tabs.defaults, params[i]);
					$(opts.tabSelector).tabs(opts);
				}
			}
		} else {
			opts = $.extend({}, $.fn.tabs.defaults, params);
			$(opts.tabSelector).tabs(opts);
		}
	});
})(jQuery);