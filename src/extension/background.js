let timeOutId;

function updateIcon() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'checkState' }, (response) => {
      if (response) {
        chrome.browserAction.setIcon({ path: 'icon16.png' });
        chrome.browserAction.enable();
      } else {
        chrome.browserAction.setIcon({ path: 'icon16-gray.png' });
        chrome.browserAction.disable();
      }
    });
  });
};

// chrome.browserAction.onClicked.addListener(updateIcon);

// 頁面網址改變
// chrome.webNavigation.onCommitted.addListener(updateIcon);
// chrome.webNavigation.onTabReplaced.addListener(updateIcon);

// 頁籤更新
chrome.tabs.onUpdated.addListener(() => {
  clearTimeout(timeOutId);
  timeOutId = setTimeout(updateIcon, 100);
});
// 頁籤切換
chrome.tabs.onSelectionChanged.addListener(updateIcon);


// 主選單設置
chrome.contextMenus.create({
  id: 'mock-contextMenus',
  title: "Lol Mock API Github",
  contexts:['browser_action']
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId == 'mock-contextMenus') {
    chrome.tabs.create({
      url: 'https://github.com/totofish/Lol-Mock-API'
    });
  }
});

updateIcon();