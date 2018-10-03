/**
 * 外掛常駐背景程式
 * background.js 在打開 chrome 後只會觸發一次
 */

let timeOutId;
let enableMode;

const control = {
  // 更新 icon 狀態
  updateIcon() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // tabs 還未有資料或功能停用時
      if (tabs.length === 0) {
        chrome.browserAction.setIcon({ path: 'icon16-gray.png' });
        chrome.browserAction.disable();
        return;
      }
      // 偵測是否有狀態
      chrome.tabs.sendMessage(tabs[0].id, { type: 'checkState' }, (response) => {
        if (response) {
          chrome.browserAction.setIcon({ path: 'icon16.png' });
          chrome.browserAction.enable();
          control.checkEnableState(tabs[0].id);
        } else {
          chrome.browserAction.setIcon({ path: 'icon16-gray.png' });
          chrome.browserAction.disable();
        }
      });
    });
  },
  // 偵測是否啟用
  checkEnableState(tabID) {
    chrome.storage.local.get(['enable'], (result) => {
      if (result.enable === false) {
        chrome.tabs.sendMessage(tabID, { type: 'destroyMock' });
      }
    });
  },
};


// chrome.browserAction.onClicked.addListener(control.updateIcon);

// 頁面網址改變
// chrome.webNavigation.onCommitted.addListener(control.updateIcon);
// chrome.webNavigation.onTabReplaced.addListener(control.updateIcon);


// 頁籤更新
chrome.tabs.onUpdated.addListener(() => {
  clearTimeout(timeOutId);
  timeOutId = setTimeout(control.updateIcon, 100);
});
// 頁籤切換
chrome.tabs.onSelectionChanged.addListener(control.updateIcon);


// 主選單設置 - 外掛安裝時
chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: 'mock-contextMenus',
    title: "Lol Mock API Github",
    contexts:['browser_action']
  });
});

// 點擊自訂選單時
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId == 'mock-contextMenus') {
    chrome.tabs.create({
      url: 'https://github.com/totofish/Lol-Mock-API'
    });
  }
});

control.updateIcon();