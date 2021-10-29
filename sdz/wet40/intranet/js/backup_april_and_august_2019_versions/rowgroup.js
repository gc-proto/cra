//Rowgroup v1.0.1 2019-08-01 CXO149//
$(function() {	
	"use strict";
$(document).on("wb-ready.wb", function () {
		$.getScript("/wet40/intranet/js/dataTables.rowGroup.min.js", function () {
			$(".table-row-group").each(function () {
				var table = $(this).DataTable();
				new $.fn.dataTable.RowGroup(table);
				var tableCol = $(this).data("wb-tables");
				var colData = tableCol.rowGroup.dataSrc;
				var colOrder = tableCol.rowGroup.orderFixed;
				var colClass = tableCol.rowGroup.className;

				table.rowGroup().order.fixed({
					pre: [colOrder]
				}).dataSrc(colData).draw();

				$(this).on('draw.dt', function () {
$(this).find("tr.group").addClass(colClass);
					$("tr.group").attr("aria-hidden", "true");

				});
				
			});
		});
	});
});