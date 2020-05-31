
const CONTEXT_MENU_ITEM_ID = "menagerie.contextMenu"
const host = "http://localhost"

var script = document.createElement('script');
script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('body')[0].appendChild(script);


function getParameterByName(name, url) {
    if (!url) return null;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({"port": 54321});
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([{
		conditions: [new chrome.declarativeContent.PageStateMatcher({})
		],
			actions: [new chrome.declarativeContent.ShowPageAction()]
		}]);
	});
});

chrome.contextMenus.removeAll(function() {
	chrome.contextMenus.create({
		id: CONTEXT_MENU_ITEM_ID,
		title: "Import into Menagerie",
		contexts: ["video", "image", "link"]
	})
})

chrome.contextMenus.onClicked.addListener(function(info, tab) {
	if (info.menuItemId == CONTEXT_MENU_ITEM_ID) {
		chrome.storage.sync.get("port", function(data) {
			const port = data.port

			var url = info["linkUrl"] || info["srcUrl"]
			if (!url) return

			if (url.startsWith("https://pbs.twimg.com/media/") && url.includes("?") && !url.slice(url.lastIndexOf("/") + 1, url.indexOf("?")).includes(".")) {
				const format = getParameterByName("format", url)
				if (!format) format = "jpg"
				url = url.slice(0, url.indexOf("?")) + "." + format + url.slice(url.indexOf("?"))
			}

      var filename = url.slice(url.lastIndexOf("/") + 1)
      if (filename.includes("?")) filename = filename.slice(0, filename.indexOf("?"))
			const apiUrl = host + ":" + port + "/upload?url=" + encodeURIComponent(url) + "&filename=" + encodeURIComponent(filename)
			console.log(apiUrl)

			$.post({
			  url: apiUrl,
			  success: function(result) {
			    console.log(result)
			  },
			  error: function(error) {
			    console.log(error)
			  }
			})
		});
	}
})
