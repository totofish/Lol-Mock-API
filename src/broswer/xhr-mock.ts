import { Polly, Request, Response } from '@pollyjs/core';
import XHRAdapter from '@pollyjs/adapter-xhr';
import FetchAdapter from '@pollyjs/adapter-fetch';
import { MockEvent, XhrMockPayload } from '../types';

Polly.register(XHRAdapter);
Polly.register(FetchAdapter);

class MockAPI {
  polly: Polly | null = null;

  async addXhrMock({
    mockURL, status, response, delay,
  }: XhrMockPayload) {
    if (this.polly) {
      await this.polly.stop();
    }

    this.polly = new Polly('Lol-mock-API', {
      adapters: ['xhr', 'fetch'],
    });

    const { server } = this.polly;
    const resFunction = async (req: Request, res: Response) => {
      await server.timeout(delay);
      res.status(status).json(JSON.parse(response));
    };

    server.get(mockURL).intercept(resFunction);
    server.post(mockURL).intercept(resFunction);
    server.put(mockURL).intercept(resFunction);
    server.patch(mockURL).intercept(resFunction);
    server.delete(mockURL).intercept(resFunction);
  }
}

const mockAPI = new MockAPI();

window.addEventListener('message', ((event: MessageEvent<XhrMockPayload>) => {
  if (event.data.id !== 'xhr-mock-extension-ui-message') return;
  if (event.data.type === MockEvent.MOCK) {
    void mockAPI.addXhrMock(event.data);
  } else if (event.data.type === MockEvent.DESTROY && mockAPI.polly) {
    void mockAPI.polly.stop();
  }
}), false);

const xhrMockApiElement = document.getElementById('xhrMockApi');
if (xhrMockApiElement) xhrMockApiElement.removeAttribute('src');
