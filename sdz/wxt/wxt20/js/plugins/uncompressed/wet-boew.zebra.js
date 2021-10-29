/* Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
Terms and conditions of use: http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Terms
Conditions régissant l'utilisation : http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Conditions
*/
/** Change Log
 * 2010.07.09 - Dave Schindler - Initial version
 * 2010.07.12 - Dave Schindler - Rewrote striping code to handle nested tables/lists as separate arrays.
 * 2010.07.13 - Dave Schindler - Rewrote striping code to better handle nested tables/lists. Nested lists now alternate which class they start with, but tables don't. Tables now work with or without headers.
 **/
(function($) {
	$.fn.zebra = function() {
		var params = $.extend({}, $.fn.zebra.defaults, Utils.loadParamsFromScriptID("zebra"));
		$(params.selector + ',' + params.selector + ' table,' + params.selector + ' ol,' + params.selector + ' ul').each(function(i) {
			var $this = $(this);
			if ($this.is('table')) {
				var $trs = ($this.children('tr').add($this.children('tbody').children('tr'))).filter(function() {
					return $(this).children('th').length === 0;
				});
				// note: even/odd's indices start at 0
				$trs.filter(':odd').addClass(params.tableEvenClass);
				$trs.filter(':even').addClass(params.tableOddClass);
				// Using delegate instead of live because of a bug in jQuery 1.4.2's live function.
				$trs.delegate('td', 'hover', function(e) {
					e.stopPropagation();
					$(this).closest('tr').toggleClass(params.tableHoverClass);
				});
			} else {
				var $lis = $this.children('li');
				var parity = ($this.parents('li').length + 1) % 2;
				$lis.filter(':odd').addClass(parity === 0 ? params.listOddClass : params.listEvenClass);
				$lis.filter(':even').addClass(parity === 1 ? params.listOddClass : params.listEvenClass);
				// Using bind instead of live because there's a bug in jQuery 1.4.2's live and delegate functions.
				$lis.bind('mouseover mouseout', function(e) {
					e.stopPropagation();
					$(this).toggleClass(params.listHoverClass);
				});
			}
		});
		return this;
	};
	
	$.fn.zebra.defaults = {
		selector: ".zebra",
		tableEvenClass: "table-even",
		tableOddClass: "table-odd",
		tableHoverClass: "table-hover",
		listEvenClass: "list-even",
		listOddClass: "list-odd",
		listHoverClass: "list-hover"
	};
	
	Utils.addCSSSupportFile(Utils.getSupportPath() + "/zebra/style.css");
	$(document).ready(function() {
		$.fn.zebra();
	});
})(jQuery);