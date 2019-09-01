const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

const ALEXA_ENDPOINT = 'https://api.amazonalexa.com';
const MOCK_EMAIL_ADDRESS = '/* removed */';

module.exports = {
  mockGetEmail: () => {
    const mock = new MockAdapter(axios);
    mock
      .onGet(`${ALEXA_ENDPOINT}//v2/accounts/~current/settings/Profile.email`)
      .reply(200, MOCK_EMAIL_ADDRESS);
    return mock;
  },

  cleanMock: mock => mock.restore(),
};
