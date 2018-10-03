import { Polly } from '@pollyjs/core';
import XHRAdapter from '@pollyjs/adapter-xhr';
import FetchAdapter from '@pollyjs/adapter-fetch';

Polly.register(XHRAdapter);
Polly.register(FetchAdapter);

const MockAPI = {
  polly: null,
  addXhrMock: async ({ mockURL, status, response, delay }) => {
    if (MockAPI.polly) {
      await MockAPI.polly.stop();
    }

    MockAPI.polly = new Polly('Lol-mock-API', {
      adapters: ['xhr', 'fetch'],
    });

    const { server } = MockAPI.polly;
    const resFunction = async (req, res) => {
      await server.timeout(delay);
      res.status(status).json(JSON.parse(response));
    };

    server.get(mockURL).intercept(resFunction);
    server.post(mockURL).intercept(resFunction);
    server.put(mockURL).intercept(resFunction);
    server.patch(mockURL).intercept(resFunction);
    server.delete(mockURL).intercept(resFunction);
  }
};

addEventListener('message', (event => {
  if (event.data.id !== 'xhr-mock-api-message') return;
  if (event.data.type === 'mock') {
    MockAPI.addXhrMock(event.data);
  } else if (event.data.type === 'destroy' && MockAPI.polly) {
    MockAPI.polly.stop();
  }
}), false);

document.getElementById('xhrMockApi').removeAttribute('src');