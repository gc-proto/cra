var btn = document.querySelector("#btn");
var urlFetch = window.location.href;
var pageTitle = document.querySelector("h1").textContent;

if (urlFetch.match("-e.html$")) {
 btn.addEventListener("click", function() {
 "use strict";
 btn.href = "mailto:?subject=Here is some useful information about '" + pageTitle + "'&body=" + urlFetch;
}
);
} else if (urlFetch.match("-f.html$")) {
 btn.addEventListener("click", function() {
 "use strict";
 btn.href = "mailto:?subject=Voici de l'information utile à propos de « " + pageTitle + " »&body=" + urlFetch;
});
}
