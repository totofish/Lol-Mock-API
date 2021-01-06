/**
 * 在網頁中運行的程式，能夠讀取瀏覽器訪問的網頁的詳細信息，但是與網頁執行環境有隔離無法直接操作，
 * 但可以透過 window.postMessage 溝通，請網頁上的程式做事，
 * 另外也還可以使用 chrome.runtime.onMessage 跟 background.js, mock-api.js 傳遞訊息
 */

import {
  ExtensionEvent, MockEvent, XhrMockData, XhrMockPayload,
} from '../types';

/// ////////////////////////////
// xhr-mock
/// ////////////////////////////

function initial(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.xhrMockApi === undefined) {
      // 將主程式置入 Browser
      const script = document.createElement('script');
      script.id = 'xhrMockApi';
      document.getElementsByTagName('body')[0].appendChild(script);
      script.src = chrome.extension.getURL('broswer/xhr-mock.js');
      script.onload = () => {
        resolve();
      };
      script.onerror = () => {
        reject();
      };
    } else {
      resolve();
    }
  });
}

// 執行 Browser 上 Mock 程式
function callMockAPI(mockExtensionData: XhrMockData) {
  const { type } = mockExtensionData;
  if (type === MockEvent.DESTROY) {
    postMessage({
      id: 'xhr-mock-api-message',
      type,
    } as XhrMockPayload, '*');
  } if (type === MockEvent.MOCK) {
    const scriptPromise = initial();
    scriptPromise.then(() => {
      const timeout = mockExtensionData.timeout ? mockExtensionData.timeout.split('-') : [];
      let responseTime = timeout.filter((item) => item !== '').map((time) => parseInt(time, 10));
      let delay = 0;
      if (responseTime.length < 1) responseTime = [100, 200];
      if (responseTime.length === 2) {
        delay = Math.floor(Math.random() * Math.abs(responseTime[0] - responseTime[1]))
          + Math.min(responseTime[0], responseTime[1]);
      } else if (responseTime.length === 1) {
        [delay] = responseTime;
      }

      postMessage({
        id: 'xhr-mock-api-message',
        type: mockExtensionData.type,
        mockURL: mockExtensionData.mockURL,
        status: mockExtensionData.status ? parseInt(mockExtensionData.status, 10) : 0,
        response: JSON.stringify(mockExtensionData.response),
        delay,
      } as XhrMockPayload, '*');
    }).catch((err) => {
      console.log('xhrMockApi error', err);
    });
  }
}

chrome.runtime.onMessage.addListener((
  mockExtensionData: { type: ExtensionEvent } | XhrMockData,
  sender,
  sendResponse,
) => {
  switch (mockExtensionData.type) {
    // 來自 background 訊息
    case ExtensionEvent.CHECK_STATE:
      // 確認是在普通網頁
      sendResponse(JSON.stringify({
        href: window.location.href,
      }));
      break;
    // 來自 background, extension-ui 訊息
    case ExtensionEvent.DESTROY_MOCK:
      callMockAPI({ type: MockEvent.DESTROY } as XhrMockData);
      break;
    // 來自 extension-ui 訊息
    case MockEvent.MOCK:
    default: {
      const response: unknown = JSON.parse(mockExtensionData.response as string);
      callMockAPI({
        ...mockExtensionData,
        response,
        type: MockEvent.MOCK,
      } as XhrMockData);
      sendResponse('ok');
    }
  }
});
