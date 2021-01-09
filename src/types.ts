export enum MockEvent {
  MOCK = 'MOCK',
  DESTROY = 'DESTROY',
}

// extension 內部通知事件
export enum ExtensionEvent {
  CHECK_STATE = 'CHECK_STATE',
  DESTROY_MOCK = 'DESTROY_MOCK',
}

// extension-content to broswer message
export interface XhrMockPayload {
  id: 'xhr-mock-extension-ui-message';
  type: MockEvent;
  mockURL: string;
  status: number;
  response: string;
  delay: number;
}

// extension-ui to extension-content message
export interface XhrMockData {
  type: MockEvent;
  mockURL?: string;
  status?: string;
  response?: string | unknown;
  timeout?: string;
}

// 外掛視窗 input 資料
export interface Inputs {
  mockURL?: HTMLInputElement | null;
  status?: HTMLInputElement | null;
  response?: HTMLTextAreaElement | null;
  timeout?: HTMLInputElement | null;
}
