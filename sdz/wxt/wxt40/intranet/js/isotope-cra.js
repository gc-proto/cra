// filter functions
var filterFns = {};

function getHashFilter() {
    // get filter=filterName
    var matches = location.hash.match(/filter=([^&]+)/i);
    var hashFilter = matches && matches[1];
    return hashFilter && decodeURIComponent(hashFilter);
}
$(function() {
    var $grid = $('#container-folio');
    // bind filter button click
    var $filterButtonGroup = $('#filters');
    $filterButtonGroup.on('click', 'button', function() {
        var filterAttr = $(this).attr('data-filter');
        // set filter in hash
        location.hash = 'filter=' + encodeURIComponent(
            filterAttr);
    });
    var isIsotopeInit = false;

    function onHashchange() {
        var hashFilter = getHashFilter();
        if (!hashFilter && isIsotopeInit) {
            return;
        }
        isIsotopeInit = true;
        // filter isotope
        $grid.isotope({
            itemSelector: '.box',
            layoutMode: 'fitRows',
            // use filterFns
            filter: filterFns[hashFilter] || hashFilter
        });
        // set selected class on button
        if (hashFilter) {
            $filterButtonGroup.find('.active').attr("aria-pressed",
                "false");
            $filterButtonGroup.find('.active').next().removeClass(
                "wb-inv").addClass("hidden");
            $filterButtonGroup.find('.active').next().attr(
                "aria-hidden", "true");
            $filterButtonGroup.find('.active').addClass('btn-link ')
                .removeClass('active btn-primary');
            $filterButtonGroup.find('[data-filter="' + hashFilter +
                '"]').addClass('active btn-primary').removeClass(
                'btn-link hidden');
            $filterButtonGroup.find('[data-filter="' + hashFilter +
                '"]').attr("aria-pressed", "true");
            $filterButtonGroup.find('[data-filter="' + hashFilter +
                '"]').next().removeClass("hidden").addClass(
                "wb-inv");
            $filterButtonGroup.find('[data-filter="' + hashFilter +
                '"]').next().attr("aria-hidden", "false");
        }
        countItems();
    }
    $(window).on('hashchange', onHashchange);
    // trigger event handler to init Isotope
    onHashchange();
});
$(function() {
    // quick search regex
    var qsRegex;
    var buttonFilter;
    $('#filters').on('click', 'button', function() {
        var $grid = $('#container-folio');
        buttonFilter = $(this).attr('data-filter');
        $('#quicksearch').val('');
        $grid.isotope();
        $grid.on('layoutComplete', countItems());
        //countItems();
    });
    // use value of search field to filter
    var $quicksearch = $('#quicksearch').keyup(debounce(function() {
        // init Isotope
         var $grid = $('#container-folio').isotope({
            itemSelector: '.box',
            layoutMode: 'fitRows',
            filter: function() {
               var $this = $(this);
				var qsRegex = [];
            var resultRegex = [];
            var searchResult = new Boolean();
            var searchId = $('#quicksearch').val();
            var searchTable = searchId.split(" ");
            for (var i = 0; i < searchTable.length; i++) {
                qsRegex[i] = new RegExp(searchTable[i], 'gi');
                resultRegex[i] = qsRegex[i] ? $this.text().match(qsRegex[i]) : true;
                searchResult = searchResult && resultRegex[i];
            }
				  var buttonResult = buttonFilter ?
                    $this.is(buttonFilter) :
                    true;
            return searchResult  &&
                    buttonResult;
        }
          
        });
        //check if hash filter is active
        var hashFilter = getHashFilter();
        var numitems2 = 0;
        if (hashFilter) {
            qsRegex = new RegExp($quicksearch.val(), 'gi');
            //check if search box is empty if equals to: /(?:)/gi
            if (qsRegex != "/(?:)/gi") {
                $grid.isotope({
                    filter: function() {
                        var $this = $(this);
                        var searchResult =
                            qsRegex ? $this.text()
                            .match(qsRegex) :
                            true;
                        var hashResult =
                            hashFilter ? $this.is(
                                hashFilter) :
                            true;
                        return searchResult &&
                            hashResult;
                    }
                });
                //Count the result of items and put into results div
                countItems();
            } else {
                $grid.isotope({
                    filter: filterFns[hashFilter] ||
                        hashFilter
                });
                countItems();
            }
        } else {
            //Search by what the button is and count results
            qsRegex = new RegExp($quicksearch.val(), 'gi');
            $grid.isotope();
            countItems();
        }
    }));
    // change is-checked class on buttons and add/ remove nessicary classes on links following
    $('.button-group').each(function(i, buttonGroup) {
        var $buttonGroup = $(buttonGroup);
        $buttonGroup.on('click', 'button', function() {
            $buttonGroup.find('.is-checked').attr(
                "aria-pressed", "false");
            $buttonGroup.find('.is-checked').next().removeClass(
                "wb-inv").addClass("hidden");
            $buttonGroup.find('.is-checked').next().attr(
                "aria-hidden", "true");
            $buttonGroup.find('.is-checked').removeClass(
                'is-checked');
            $(this).addClass('is-checked');
            $(this).attr("aria-pressed", "true");
            $(this).next().removeClass("hidden").addClass(
                "wb-inv");
            $(this).next().attr("aria-hidden", "true");
        });
    });
});

function countItems() {
        var iso = $('#container-folio').data('isotope');
        //access Isotope properties
        var items = iso.filteredItems.length;
        var lang = $('html').attr('lang');
        if (lang == "en") {
            $("#results").text("Number of items: " + items);
        } else {
            $("#results").text("Nombre d'objets : " + items);
        }
    }
    // debounce so filtering doesn't happen every millisecond

function debounce(fn, threshold) {
    var timeout;
    return function debounced() {
        if (timeout) {
            clearTimeout(timeout);
        }

        function delayed() {
            fn();
            timeout = null;
        }
        setTimeout(delayed, threshold || 100);
    };
}

var textProp = document.documentElement.textContent !== undefined ? 'textContent' : 'innerText';
function getText( elem ) {
  return elem[ textProp ];
}



//Isotope filter save state
var url = window.location.pathname;
url = url.split("english/").pop().split("francais/").pop().split('#').pop().split('?').pop();
var unqname = url.substring("/", url.lastIndexOf("-") + 0);

$(document).ready(function () {
var testing = localStorage.getItem(unqname);
$( window ).on("load", function() {
$("button[data-filter='" + testing + "']").trigger('click');});

$('#filters button').on('click', function () {
 var $svst = $(this);
	$svst.data('filter') == "*"
	{localStorage.removeItem(unqname);}

   });
$('.filter-save button').on('click', function () {
 var $svst = $(this);
	if ($svst.data('filter') == "*")
	{localStorage.removeItem(unqname);}
	else
	{
localStorage.setItem(unqname, $svst.data('filter'));}
   });
});
$(document).ready(function () {
var testing = sessionStorage.getItem(unqname);
$( window ).on("load", function() {
$("button[data-filter='" + testing + "']").trigger('click');});

$('#filters button').on('click', function () {
 var $svst = $(this);
	$svst.data('filter') == "*"
	{sessionStorage.removeItem(unqname);}

   });
$('.filter-temp-save button').on('click', function () {
 var $svst = $(this);
	if ($svst.data('filter') == "*")
	{sessionStorage.removeItem(unqname);}
	else
	{
sessionStorage.setItem(unqname, $svst.data('filter'));}
   });
   
});
   
//Isotope reset button 
//Apended button design commented out (not deleted)
//var theLanguage = $('html').attr('lang');
var $grid = $('#container-folio');
//$('#quicksearch').wrap('<div class="input-group"></div>');
//$('<span class="input-group-btn"><input style="font-family:FontAwesome" type="button" class="btn btn-default" id="filter-reset" value="&#xf0e2;" aria-label="' + (theLanguage === 'en' ? 'Reset' : 'Réinitialiser')  +'"></span>').insertAfter('#quicksearch');
$("#filter-reset").click(function() {
$("#quicksearch").val('')
    $grid.isotope({ filter: '*' });
	 $grid.on('layoutComplete', countItems());
	  if(window.location.hash.indexOf('filter') == 1) {
	 var hash = location.hash.replace('#','');
  location.hash = 'filter=*'; }
  else{none}
 
});