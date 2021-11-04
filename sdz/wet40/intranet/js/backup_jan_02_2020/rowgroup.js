$(function() {	
	
$(".table-row-group").on("wb-ready.wb-tables", function (event) {
	
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
$(this).find("td[colspan]").addClass(colClass).parent().attr("aria-hidden","true");	 		 
table.on("draw.dt", function () {$(this).find("td[colspan]").addClass(colClass).parent().attr("aria-hidden","true");});
				
			});
		});
	});
});
