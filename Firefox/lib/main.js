var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
pageMod.PageMod({
	include: "*.reddit.com",
	contentScriptFile: self.data.url("scripts/infinity.js"),
	contentScriptOptions: {
		"loadingGIF": self.data.url("images/loading.gif")
	}
});