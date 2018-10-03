/**
 * 外掛主視窗程式
 */

import './mock-api.scss';

let inputs = {};
let submitted = false;
let enableMode = false;

// storage
const storageControl = {
  setData(enable) {
    chrome.storage.local.set({ enable }, () => {
      console.log('Value is set to ' + enable);
    });
  },
  getData() {
    // 偵測啟用狀態
    chrome.storage.local.get(['enable'], (result) => {
      if (typeof result.enable !== 'boolean') {
        enableMode = true;
      } else {
        enableMode = result.enable;
      }
      viewControl.enabledState(enableMode);
    });
  },
  saveRecord(data) {
    localStorage.setItem('mockExtensionData', JSON.stringify(data));
  }
}

const viewControl = {
  classControl(element, bo) {
    if (bo) element.classList.remove("label--warning");
    else element.classList.add("label--warning");
  },
  getInputValue() {
    const mockURL = inputs.mockURL.value.trim();
    const status = inputs.status.value.trim();
    const response = inputs.response.value.trim();
    const timeout = inputs.timeout.value.trim() || '100-200';
    return {
      mockURL,
      status,
      response,
      timeout,
    }
  },
  // 欄位驗證
  verify() {
    const {
      mockURL,
      status,
      response,
      timeout,
    } = viewControl.getInputValue();

    const verificationURL = !!mockURL;
    const verificationStatus = !!status;
    let verificationResponse = !!response;

    try {
      JSON.parse(response);
    } catch(e) {
      verificationResponse = false;
    }

    viewControl.classControl(document.querySelector('.label-url'), verificationURL);
    viewControl.classControl(document.querySelector('.label-status'), verificationStatus);
    viewControl.classControl(document.querySelector('.label-response'), verificationResponse);

    return {
      response,
      mockURL,
      timeout,
      status
    }
  },
  // 送出
  handleMockClick(e) {
    submitted = true;
    const {
      response,
      mockURL,
      timeout,
      status
    } = viewControl.verify();
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

    viewControl.sendMessage({
      ...mockExtensionData,
      type: 'mock',
    });

    setTimeout(window.close, 100);
  },
  sendMessage(data) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, data, (response) => {
          // localStorage.setItem('mockExtensionData', JSON.stringify(mockExtensionData));
        });
    });
  },
  // 欄位值改變
  handleChange(e) {
    const data = viewControl.getInputValue();
    storageControl.saveRecord(data);
    if (!submitted) return;
    viewControl.verify();
  },
  // state
  enabledState(enable) {
    if (
      document.readyState !== 'interactive'
      && document.readyState !== 'complete'
    ) return;
    const main = document.querySelector('#main');
    const enableSwitch = document.querySelector('#enableSwitch');
    if (enable) {
      main.style.display = null;
      enableSwitch.checked = true;
    } else {
      main.style.display = "none";
      enableSwitch.checked = false;
    }
  },
  DOMContentLoaded() {
    inputs = {
      mockURL: document.querySelector('#mockURL'),
      status: document.querySelector('#status'),
      response: document.querySelector('#response'),
      timeout: document.querySelector('#timeout'),
    };
    viewControl.enabledState(enableMode);
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
      divs[i].addEventListener('click', viewControl.handleMockClick);
    }

    const enableSwitch = document.querySelector('#enableSwitch');
    enableSwitch.addEventListener('change', (event) => {
      const { checked } = event.target;
      if (checked !== enableMode) {
        enableMode = checked;
        storageControl.setData(enableMode);
        viewControl.enabledState(enableMode);
        if (!checked) {
          viewControl.sendMessage({ type: 'destroyMock' });
        }
      }
    });

    // 偵測 input 變化
    Object.keys(inputs).forEach((key) => {
      inputs[key].addEventListener('change', viewControl.handleChange);
      inputs[key].addEventListener('keyup', viewControl.handleChange);
    });
  }
};

storageControl.getData();

document.addEventListener('DOMContentLoaded', viewControl.DOMContentLoaded);
