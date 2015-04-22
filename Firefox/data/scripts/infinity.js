var content = document.getElementById("siteTable");
var navigation = content.querySelector(".nav-buttons");
var loadingNewContent = false;

var loading = document.createElement("span");
loading.id = "redditInfinity-loading";

var loadingGIF = document.createElement("img");
loadingGIF.src = self.options.loadingGIF;
loadingGIF.style.position = "relative";
loadingGIF.style.top = "7px";
loadingGIF.style.left = "17px";
loading.appendChild(loadingGIF);

var loadingText = document.createElement("span");
loadingText.style.paddingLeft = "20px";
loadingText.style.fontSize = "12px";
loadingText.textContent = "Loading...";
loading.appendChild(loadingText);

if(content && navigation) init();

function init() {
	pageReload();

	window.history.replaceState({
		content: content.innerHTML
	}, "", document.location.href);

	window.addEventListener("scroll", function() {
		if(elementVisible(content.children[content.children.length - 6]) && !loadingNewContent) {
			loadingNewContent = true;
			navigation.appendChild(loading);

			var nextURL = navigation.querySelector(".nextprev a[rel*='next']").href;
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open("GET", nextURL, true);
			xmlhttp.onreadystatechange = function() {
				if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					var parser = new DOMParser();
					var dom = parser.parseFromString(xmlhttp.responseText, "text/html");

					if(dom) {
						var newContent = dom.getElementById("siteTable");
						window.history.pushState({
							content: newContent.innerHTML
						}, "", nextURL);

						for(var i = 0; i < newContent.children.length; ++i) {
							var rank = newContent.children[i].querySelector("span.rank");
							if(rank) rank.style.width = (rank.textContent.length * 1.1) + "ex";
							content.appendChild(newContent.children[i]);
						}
						content.removeChild(navigation);
						navigation = content.querySelector(".nav-buttons");

						loadingNewContent = false;
					} else {
						window.location = nextURL;
					}
				}
			};
			xmlhttp.send();
		}
	});
}

function pageReload() {
	navigation = content.querySelector(".nav-buttons");
	loadingNewContent = false;

	setTimeout(function() {
		window.scrollTo(0, 0);
	}, 1);
}

// http://stackoverflow.com/a/125106
function elementVisible(element) {
	if(loadingNewContent || !element) return false;
	var top = element.offsetTop;
	var left = element.offsetLeft;
	var width = element.offsetWidth;
	var height = element.offsetHeight;

	while(element.offsetParent) {
		element = element.offsetParent;
		top += element.offsetTop;
		left += element.offsetLeft;
	}

	return (
		top < (window.pageYOffset + window.innerHeight) &&
		left < (window.pageXOffset + window.innerWidth) &&
		(top + height) > window.pageYOffset &&
		(left + width) > window.pageXOffset
	);
}

window.onpopstate = function(e){
	if(e.state) {
		loadingNewContent = true;
		content.innerHTML = e.state.content;
		pageReload();
	}
};