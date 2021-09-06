chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({
      'url': chrome.extension.getURL('../index.html')
  }, function(tab) {
  });
});

chrome.contextMenus.create({
  "title": "ScholarMe",
  "contexts": ["selection"],
  onclick:function(params)
  {
  chrome.tabs.create({
    'url': chrome.extension.getURL('../index.html') + "?text=" + encodeURI(params.selectionText)});
  }
});
