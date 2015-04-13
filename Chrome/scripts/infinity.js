var content = document.getElementById("siteTable");
var navigation, loadingNewContent;

if(content) init();

function init() {
	pageReload();

	window.history.replaceState({
		content: content.innerHTML
	}, "", document.location.href);

	window.addEventListener("scroll", function() {
		if(elementVisible(navigation) && !loadingNewContent) {
			loadingNewContent = true;

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