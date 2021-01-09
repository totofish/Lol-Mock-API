/**
 * 外掛常駐背景程式
 * background.js 在打開 chrome 後只會觸發一次
 */

import { ExtensionEvent } from '../types';

const control = {
  // disable extension
  disableExtension: () => {
    chrome.browserAction.setIcon({ path: 'icon16-gray.png' });
    chrome.browserAction.disable();
  },
  // enable extension
  enableExtension: () => {
    chrome.browserAction.setIcon({ path: 'icon16.png' });
    chrome.browserAction.enable();
  },
  // 更新 icon 狀態
  updateIcon: () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // tabs 還未有資料或功能停用時
      if (tabs.length === 0) {
        control.disableExtension();
        return;
      }
      const { id, url } = tabs[0];
      // 非正常網頁
      if (!url || !/^https?:/.test(url)) {
        control.disableExtension();
        return;
      }
      if (id === undefined) return;

      // 偵測是否有狀態
      chrome.tabs.sendMessage(id, { type: ExtensionEvent.CHECK_STATE }, (response) => {
        if (chrome.runtime.lastError) {
          // 與 content 的連接尚未完成則跳脫
          control.disableExtension();
          return;
        }

        if (response) {
          control.enableExtension();
          control.checkEnableState(id);
        } else {
          control.disableExtension();
        }
      });
    });
  },
  // 偵測是否啟用
  checkEnableState: (tabID: number) => {
    chrome.storage.local.get(['enable'], (result) => {
      if (result.enable === false) {
        chrome.tabs.sendMessage(tabID, { type: ExtensionEvent.DESTROY_MOCK });
      }
    });
  },
};

// chrome.browserAction.onClicked.addListener(control.updateIcon);

// 頁面網址改變
// chrome.webNavigation.onCommitted.addListener(control.updateIcon);
// chrome.webNavigation.onTabReplaced.addListener(control.updateIcon);

// 頁籤更新
chrome.tabs.onUpdated.addListener(control.updateIcon);
// 頁籤切換
chrome.tabs.onActivated.addListener(control.updateIcon);

// 主選單設置 - 外掛安裝時
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'mock-contextMenus',
    title: 'Lol Mock API Github',
    contexts: ['browser_action'],
  });
});

// 點擊自訂選單時
chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === 'mock-contextMenus') {
    chrome.tabs.create({
      url: 'https://github.com/totofish/Lol-Mock-API',
    });
  }
});
