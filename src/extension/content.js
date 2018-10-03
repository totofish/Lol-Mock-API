/**
 * 在網頁中運行的程式，能夠讀取瀏覽器訪問的網頁的詳細信息，但是與網頁執行環境有隔離無法直接操作，
 * 但可以透過 window.postMessage 溝通，請網頁上的程式做事，
 * 另外也還可以使用 chrome.runtime.onMessage 跟 background.js, mock-api.js 傳遞訊息
 */

///////////////////////////////
// xhr-mock
///////////////////////////////

function initial () {
  return new Promise((resolve, reject) => {
    if (window.xhrMockApi === undefined) {
      // 將主程式置入 Browser
      var script = document.createElement('script');
      script.id = 'xhrMockApi';
      document.getElementsByTagName("body")[0].appendChild(script);
      script.src = chrome.extension.getURL('broswer/xhr-mock.js');
      script.onload = () => {
        resolve();
      };
      script.onerror = () => {
        reject();
      }
    } else {
      resolve();
    }
  });
}

// 執行 Browser 上 Mock 程式
function callMockAPI(mockExtensionData) {
  const { type } = mockExtensionData;
  if (type === 'destroy') {
    postMessage({
      id: 'xhr-mock-api-message',
      type: mockExtensionData.type,
    }, '*');
  } if (type === 'mock') {
    const scriptPromise = initial();
    scriptPromise.then(() => {
      // console.log('xhrMockApi init');
      const timeout = mockExtensionData.timeout.split('-');
      let responseTime = timeout.filter((item) => item !== '').map((time) => parseInt(time));
      let delay = 0;
      if (responseTime.length < 1) responseTime = [100, 200];
      if (responseTime.length === 2) {
        delay = Math.floor(Math.random() * Math.abs(responseTime[0] - responseTime[1])) + Math.min(responseTime[0], responseTime[1]);
      } else if (responseTime.length === 1) {
        delay = responseTime[0];
      }

      postMessage({
        id: 'xhr-mock-api-message',
        type: mockExtensionData.type,
        mockURL: mockExtensionData.mockURL,
        status: parseInt(mockExtensionData.status),
        response: JSON.stringify(mockExtensionData.response),
        delay
      }, '*');
    }).catch((err)=> {
      console.log('xhrMockApi error', err);
    });
  }
}

chrome.runtime.onMessage.addListener((mockExtensionData, sender, sendResponse) => {
  switch (mockExtensionData.type) {
    case 'checkState': // 偵聽 background 主程式訊息
      // 確認是在普通網頁
      sendResponse(JSON.stringify({
        href: window.location.href
      }));
      break;
    case 'destroyMock':
      callMockAPI({ type: 'destroy' });
      break;
    case 'mock': // 偵聽 mock-api.js 訊息
    default:
      mockExtensionData.response = JSON.parse(mockExtensionData.response);
      callMockAPI({
        ...mockExtensionData,
        type: 'mock',
      });
      sendResponse('ok');
  }
});
