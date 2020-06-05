/*Language definer */

var pgLang = $("html").prop("lang");

 

//Ajax anchor script

$( document ).ajaxComplete(function()

{

var hashtag = location.hash.substr(1);

var elmnt = document.getElementById(hashtag);

if(elmnt){elmnt.scrollIntoView();}

//empty hash

});

 

 

//TOC builder 2.0

                                           

               

 $(function(){

                "use strict";

if ($("#tocList").length>0) {

$("h2.toc, h3.toc").each(function () {

 

               

 

var prevHeaderItem = null;

var prevHeaderList = null;

                //insert an anchor to jump to, from the TOC link.           

                var index = $(this).attr("id");

 

                var li = "<li><a href='#" + index + "'>" + $(this).text() + "</a></li>";

 

                if ($(this).is("h2.toc")) {

 

                                prevHeaderItem = $(li);

 

                                prevHeaderItem.appendTo("#tocList");

                } else {

                                prevHeaderList = $('<ul></ul>');

                                prevHeaderItem.append(prevHeaderList);

                                prevHeaderList.append(li);

                }

                index++;

});

 

               

switch(pgLang.toLowerCase()){

                               

                                                case "fr":

                                                                $('<h2 class="h3 mrgn-tp-md">Sur cette page</h2>').insertBefore("#tocList");

                                                               

                                break;

                                                case "en":

               

               

                $('<h2 class="h3 mrgn-tp-md">On this page</h2>').insertBefore("#tocList");

}

}

 

});

 

                                                               

/*Top of page scroll */

$(function(){

                "use strict";

 

                var lastScrollTop = 0, delta = 5;

 

                $(window).scroll(function(){

                                var nowScrollTop = $(this).scrollTop();

                                if(Math.abs(lastScrollTop - nowScrollTop) >= delta){

                                               if (nowScrollTop > lastScrollTop){

                                                               $("#tp-pg").removeClass("stuck");

                                               }

else if (nowScrollTop < delta ) {   $("#tp-pg").removeClass("stuck");}

else {

                                                                $("#tp-pg").addClass("stuck");

                                                }

                                lastScrollTop = nowScrollTop;

                                }

                });

});

$(function(){

$('#tp-pg').on('click', function(){

    $(this).removeClass('stuck');

 

});

});

/*Identifier for active page and Pagnation builder*/

$(function() {

                "use strict";

                                function activeTake(){

var lastpart  = window.location.pathname.split("/").pop();

   var targetitem = $('.section-menu .vertical-steps li a[href*="' + lastpart + '"]')

 

                var posttarget = targetitem.removeAttr("href").parents('li').addClass('active').parents().removeClass("hidden");

                var active = $("li.active");

 

                active.prevAll().addClass("completed");

  active.children("ol,ul").removeClass("hidden");

                active.closest("li").parents("li").removeClass("active").addClass("completed");

                return true;}

 

                                function pagNation() {

var selected = $("li.active a");

var anchors = $("#steps-menu a");

 

var pos = anchors.index(selected);

var next = anchors.get(pos+1);

var prev = anchors.get(pos-1);

 

 

//var nextPagE = $('<span class="wb-inv-md wb-inv-lg">Next </span>');

//var nextPagF = $('<span class="wb-inv-md wb-inv-lg">Suivant </span>');

var nextPagE = $('<span class="wb-inv">Next </span>');

var nextPagF = $('<span class="wb-inv">Suivant </span>');

//var prevPagE = $('<span class="wb-inv-lg">Previous </span>');

//var prevPagF = $('<span class="wb-inv-lg">Précédent </span>');

 

if ($(".section-menu").find("li:first").is(".active")){

switch( pgLang.toLowerCase() ){

                                                case "fr":

                                                                //$(next).clone().appendTo( ".pull-pager .next" ).attr({"rel":"next"}).wrapInner('<span class="wb-inv-xs wb-inv-sm"></span>').prepend(nextPagF);

                                $(next).clone().appendTo( ".pull-pager .next" ).attr({"rel":"next"}).prepend(nextPagF);

                                                               

                                break;

                                                case "en":

                                                default:

//$(next).clone().appendTo( ".pull-pager .next" ).attr({"rel":"next"}).wrapInner('<span class="wb-inv-xs wb-inv-sm"></span>').prepend(nextPagE);

$(next).clone().appendTo( ".pull-pager .next" ).attr({"rel":"next"}).prepend(nextPagE);                   

}

}

 

                if (!$(".section-menu").find("li:first").is(".active")){

                switch( pgLang.toLowerCase() ){

                                                case "fr":

                                //$(next).clone().appendTo( ".pull-pager .next" ).attr({"rel":"next"}).wrapInner('<span class="wb-inv-xs wb-inv-sm"></span>').prepend(nextPagF);

                $(next).clone().appendTo( ".pull-pager .next" ).attr({"rel":"next"}).prepend(nextPagF);

                                                //$(prev).clone().appendTo(".pull-pager .previous" ).attr({"rel":"prev"}).wrapInner(prevPagF);

                                                                break;

                                                case "en":

                                                default:

                                //            $(next).clone().appendTo( ".pull-pager .next" ).attr({"rel":"next"}).wrapInner('<span class="wb-inv-xs wb-inv-sm"></span>').prepend(nextPagE);

                                $(next).clone().appendTo( ".pull-pager .next" ).attr({"rel":"next"}).prepend(nextPagE);

                //$(prev).clone().appendTo(".pull-pager .previous" ).attr({"rel":"prev"}).wrapInner('<span class="wb-inv-xs wb-inv-sm wb-inv-md"></span>').prepend(prevPagE);

                                }

}}

 

$( document ).on( "wb-ready.wb", function( event ) {

 

$.get(activeTake()).done(pagNation());

  })

});

/*Navigation collapse in small devices */

$( document ).on( "wb-ready.wb", function( event ) {

$(".menu-title").clone().removeClass("menu-title").insertBefore(".menu-header").addClass("hidden");

$(".menu-header .menu-title").replaceWith(function () {

    return $('<p />', {

                                class: "menu-title",

        html: '<span class="wb-inv-md wb-inv-lg">' + document.getElementById("wb-cont-section").innerHTML + ':</span> ' + this.innerHTML

    });

});

$(window).resize(function() {

var $parent = $( "main.container"), $html = $('.section-menu'), $htmlHeader = $('.section-menu .menu-header'), $htmlTitle = $('.section-menu .menu-title');

var margin = $parent.width() - 30;

if ($html.width() >= margin ) {

return $html.addClass('mobile'), $htmlHeader.attr({'role': 'button', 'tabindex': '0'}).attr('aria-expanded', function() {if ($html.hasClass('open')) {return "true"}

else {return "false"}

});

}

                $html.removeClass('mobile')

$htmlHeader.removeAttr('aria-expanded role tabindex');

}).trigger('resize');

 

function navClick(event){

    if(event.type === 'click'){

        return true;

    }

    else if(event.type === 'keypress'){

        var code = event.charCode || event.keyCode;

        if((code === 32)|| (code === 13)){

            return true;

        }

    }

    else{

        return false;

    }

}

// $( document).on('click keypress', '.section-menu.mobile .menu-header', function(event) {

//            if(navClick(event)=== true) {

//              $( this ).attr('aria-expanded',$(this).attr('aria-expanded')==='false'?'true':'false' );

//                            $(".menu-body").slideToggle(500, function(){$( this ).parent('.section-menu.mobile').toggleClass( "open" ), $(this).removeAttr('style');});

// }}); disable the click behaviour

                });

//Append second H1 anchor link to mobile nav menu items

$( document ).on( "wb-ready.wb", function() {

"use strict";

        $('.section-menu-sub a').each(function(){

        if ($(window).width() < 992) { 

           $(this).attr("href", $(this).attr("href") + "#wb-cont");

                                }

                                               

        });

    });