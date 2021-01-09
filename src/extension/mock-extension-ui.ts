/**
 * 外掛主視窗程式
 */

import {
  ExtensionEvent, Inputs, MockEvent, XhrMockData,
} from '../types';
import './mock-extension-ui.scss';

let inputs: Inputs = {};
let submitted = false;
let enableMode = false;

// storage
const storageControl = {
  setData(enable: boolean) {
    chrome.storage.local.set({ enable }, () => {
      console.log(`Value is set to ${enable ? 'true' : 'false'}`);
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
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      viewControl.enabledState(enableMode);
    });
  },
  saveRecord(data: {
    mockURL?: string;
    status?: string;
    response?: string;
    timeout?: string;
  }) {
    localStorage.setItem('mockExtensionData', JSON.stringify(data));
  },
};

const viewControl = {
  classControl(element: HTMLElement | null, bo: boolean) {
    if (bo) element?.classList.remove('label--warning');
    else element?.classList.add('label--warning');
  },
  getInputValue() {
    const mockURL = inputs.mockURL?.value.trim();
    const status = inputs.status?.value.trim();
    const response = inputs.response?.value.trim();
    const timeout = inputs.timeout?.value.trim() || '100-200';
    return {
      mockURL,
      status,
      response,
      timeout,
    };
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
      JSON.parse(response || '');
    } catch (e) {
      verificationResponse = false;
    }

    viewControl.classControl(document.querySelector('.label-url'), verificationURL);
    viewControl.classControl(document.querySelector('.label-status'), verificationStatus);
    viewControl.classControl(document.querySelector('.label-response'), verificationResponse);

    return {
      response,
      mockURL,
      timeout,
      status,
    };
  },
  // 送出
  handleMockClick: () => {
    submitted = true;
    const {
      response,
      mockURL,
      timeout,
      status,
    } = viewControl.verify();
    if (!mockURL || !response || !status) {
      // eslint-disable-next-line no-new
      new Notification('請確認欄位是否設定完成', { icon: '../icon48.png' });
      return;
    }
    try {
      JSON.parse(response);
    } catch (e) {
      // eslint-disable-next-line no-new
      new Notification('Response 需要 JSON 字串', { icon: '../icon48.png' });
      return;
    }
    const mockExtensionData = {
      response,
      mockURL,
      timeout,
      status,
    };

    viewControl.sendMessage({
      ...mockExtensionData,
      type: MockEvent.MOCK,
    } as XhrMockData);

    setTimeout(window.close, 100);
  },
  sendMessage(data: XhrMockData | { type: ExtensionEvent }) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const { id } = tabs[0];
      if (id === undefined) return;
      chrome.tabs.sendMessage(id, data, () => {
        if (chrome.runtime.lastError) {
          console.log('lastError:', chrome.runtime.lastError);
        }
        // localStorage.setItem('mockExtensionData', JSON.stringify(mockExtensionData));
      });
    });
  },
  // 欄位值改變
  handleChange: () => {
    const data = viewControl.getInputValue();
    storageControl.saveRecord(data);
    if (!submitted) return;
    viewControl.verify();
  },
  // state
  enabledState(enable: boolean) {
    if (
      document.readyState !== 'interactive'
      && document.readyState !== 'complete'
    ) return;
    const main: HTMLElement | null = document.querySelector('#main');
    const enableSwitch: HTMLInputElement | null = document.querySelector('#enableSwitch');
    if (enable) {
      if (main) main.style.display = '';
      if (enableSwitch) enableSwitch.checked = true;
    } else {
      if (main) main.style.display = 'none';
      if (enableSwitch) enableSwitch.checked = false;
    }
  },
  DOMContentLoaded: () => {
    inputs = {
      mockURL: document.querySelector<HTMLInputElement>('#mockURL'),
      status: document.querySelector<HTMLInputElement>('#status'),
      response: document.querySelector<HTMLTextAreaElement>('#response'),
      timeout: document.querySelector<HTMLInputElement>('#timeout'),
    };
    if (!inputs.mockURL || !inputs.status || !inputs.response || !inputs.timeout) return;

    viewControl.enabledState(enableMode);
    // 預設值
    let mockExtensionData = {
      response: '',
      mockURL: '',
      timeout: '100-200',
      status: '200',
    };
    try {
      mockExtensionData = <typeof mockExtensionData>JSON.parse(localStorage.getItem('mockExtensionData') || '') || mockExtensionData;
    } catch (e) {
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
    for (let i = 0; i < divs.length; i += 1) {
      divs[i].addEventListener('click', viewControl.handleMockClick);
    }

    const enableSwitch = document.querySelector<HTMLInputElement>('#enableSwitch');
    enableSwitch?.addEventListener('change', (event: Event) => {
      const { checked } = event.target as HTMLInputElement;
      if (checked !== enableMode) {
        enableMode = checked;
        storageControl.setData(enableMode);
        viewControl.enabledState(enableMode);
        if (!checked) {
          viewControl.sendMessage({ type: ExtensionEvent.DESTROY_MOCK });
        }
      }
    });

    // 偵測 input 變化
    Object.keys(inputs).forEach((key) => {
      inputs[key as keyof Inputs]?.addEventListener('change', viewControl.handleChange);
      inputs[key as keyof Inputs]?.addEventListener('keyup', viewControl.handleChange);
    });
  },
};

storageControl.getData();

document.addEventListener('DOMContentLoaded', viewControl.DOMContentLoaded);
