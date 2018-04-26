///////////////////////////////
// xhr-mock
///////////////////////////////

function initial () {
  if (window.xhrMockApi === undefined) {
    // 將主程式置入 Browser
    var script = document.createElement('script');
    script.id = 'xhrMockApi';
    document.getElementsByTagName("body")[0].appendChild(script);
    script.src = chrome.extension.getURL('broswer/xhr-mock.js');
    script.onload = () => {
      // console.log('xhrMockApi init');
    };
    script.onerror = () => {
      // console.log('xhrMockApi error');
    }
  }
}

// 執行 Browser 上 Mock 程式
function callMockAPI(mockExtensionData) {
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
    type: 'mock',
    mockURL: mockExtensionData.mockURL,
    status: parseInt(mockExtensionData.status),
    response: JSON.stringify(mockExtensionData.response),
    delay
  }, '*');
}

// 偵聽主程式訊息
chrome.runtime.onMessage.addListener((mockExtensionData, sender, sendResponse) => {
  switch (mockExtensionData.type) {
    case 'checkState':
      sendResponse(window.xhrMockApi !== undefined);
      break;
    case 'mock':
    default:
      mockExtensionData.response = JSON.parse(mockExtensionData.response);
      callMockAPI(mockExtensionData);
      // 回給主程式 ok
      sendResponse('ok');
  }
});

initial();