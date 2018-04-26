import './mock-api.scss';

function mock(e) {
  const response = document.getElementById('response').value;
  const mockURL = document.getElementById('mockURL').value;
  const timeout = document.getElementById('timeout').value || '100-200';
  const status = document.getElementById('status').value;
  if (!mockURL || !response || !status) {
    new Notification("請確認欄位是否設定完成", { icon: '../icon48.png' });
    return;
  }
  try {
    JSON.parse(response);
  } catch(e) {
    new Notification("Response 需要 JSON 字串", { icon: '../icon48.png' });
    return;
  }
  const mockExtensionData = {
    response,
    mockURL,
    timeout,
    status
  };

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { ...mockExtensionData, type: 'mock' }, (response) => {
        // console.log(`response: ${response}`);
        localStorage.setItem('mockExtensionData', JSON.stringify(mockExtensionData));
      });
  });
  window.close();
}

document.addEventListener('DOMContentLoaded', function () {
  let mockExtensionData = {
    response: '',
    mockURL: '',
    timeout: '100-200',
    status: '200'
  };
  try {
    mockExtensionData = JSON.parse(localStorage.getItem('mockExtensionData')) || mockExtensionData;
  } catch(e) {
    localStorage.removeItem('mockExtensionData');
  }
  try {
    document.getElementById('response').value = JSON.stringify(JSON.parse(mockExtensionData.response), null, 2);
  } catch (e) {
    document.getElementById('response').value = mockExtensionData.response;
  }
  document.getElementById('mockURL').value = mockExtensionData.mockURL;
  document.getElementById('timeout').value = mockExtensionData.timeout;
  document.getElementById('status').value = mockExtensionData.status;
  const divs = document.querySelectorAll('#btn');
  for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', mock);
  }
});
