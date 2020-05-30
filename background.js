
const CONTEXT_MENU_ITEM_ID = "menagerie.contextMenu"
const host = "http://localhost"

var script = document.createElement('script');
script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('body')[0].appendChild(script);

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

			const apiUrl = host + ":" + port + "/upload?url=" + encodeURIComponent(url) + "&filename=" + encodeURIComponent(url.substring(url.lastIndexOf("/") + 1))
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