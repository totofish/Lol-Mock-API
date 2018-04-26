import './mock-api.scss';

let inputs = {};
let submitted = false;

function classControl(element, bo) {
  if (bo) element.classList.remove("label--warning");
  else element.classList.add("label--warning");
}

// 欄位驗證
function verify() {
  const mockURL = inputs.mockURL.value.trim();
  const status = inputs.status.value.trim();
  const response = inputs.response.value.trim();
  const timeout = inputs.timeout.value.trim() || '100-200';

  const verificationURL = !!mockURL;
  const verificationStatus = !!status;
  let verificationResponse = !!response;


  try {
    JSON.parse(response);
  } catch(e) {
    verificationResponse = false;
  }

  classControl(document.querySelector('.label-url'), verificationURL);
  classControl(document.querySelector('.label-status'), verificationStatus);
  classControl(document.querySelector('.label-response'), verificationResponse);

  return {
    response,
    mockURL,
    timeout,
    status
  }
}

function mock(e) {
  submitted = true;
  const {
    response,
    mockURL,
    timeout,
    status
  } = verify();
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

// 欄位值改變
function handleChange(e) {
  if (!submitted) return;
  verify();
}


document.addEventListener('DOMContentLoaded', function () {
  inputs = {
    mockURL: document.querySelector('#mockURL'),
    status: document.querySelector('#status'),
    response: document.querySelector('#response'),
    timeout: document.querySelector('#timeout'),
  };
  // 預設值
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
    inputs.response.value = JSON.stringify(JSON.parse(mockExtensionData.response), null, 2);
  } catch (e) {
    inputs.response.value = mockExtensionData.response;
  }
  inputs.mockURL.value = mockExtensionData.mockURL;
  inputs.timeout.value = mockExtensionData.timeout;
  inputs.status.value = mockExtensionData.status;

  const divs = document.querySelectorAll('#btn');
  for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', mock);
  }

  // 偵測 input 變化
  Object.keys(inputs).forEach((key) => {
    inputs[key].addEventListener('change', handleChange);
    inputs[key].addEventListener('keyup', handleChange);
  });
});
