import mock from 'xhr-mock';

const MockAPI = {
  addXhrMock: ({ mockURL, status, response, delay }) => {
    mock.teardown();
    mock.setup();

    const resFunction = (req, res) => {
      const body = response;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(res.status(status).headers({'Content-Type': 'application/json'}).body(body));
        }, delay);
      })
    }
    mock.get(mockURL, resFunction);
    mock.post(mockURL, resFunction);
    mock.put(mockURL, resFunction);
    mock.patch(mockURL, resFunction);
    mock.delete(mockURL, resFunction);
  }
};

addEventListener('message', (event => {
  if (event.data.id !== 'xhr-mock-api-message') return;
  MockAPI.addXhrMock(event.data);
}), false);

document.getElementById('xhrMockApi').removeAttribute('src');