const axios = require('axios');
const assert = require('assert');
const MockAdapter = require('axios-mock-adapter');
const proxyquire = require('proxyquire');
class ErrorService extends Error {
  constructor(errorKey) {
    super(errorKey);
    this.name = `${errorKey} Error`;
  }
}

const availabilityServiceMock = proxyquire('../services/AvailabilityService.js', {'./ErrorService.js': ErrorService});

describe('getAvailability method', () => {
  describe('When passed an Id that is in stock', () => {
    it('should return In Stock', async() => {
      const mock = new MockAdapter(axios);
      const data = {
        G1234567: ['', '', 2134.0],
      };
      const itemId = 'G1234567';

      mock.onPost('/* removed */', {[itemId]: ''})
        .reply(200, data);
      const result = await availabilityServiceMock.getAvailability(itemId);
      assert(result === 'in stock');
      mock.restore();
    });
  });
  describe('When passed an Id that is limited', () => {
    it('should return Limited Stock', async() => {
      const mock = new MockAdapter(axios);
      const data = {
        G1234567: ['', '', 5.0],
      };
      const itemId = 'G1234567';

      mock.onPost('/* removed */', {[itemId]: ''})
        .reply(200, data);
      const result = await availabilityServiceMock.getAvailability(itemId);
      assert(result === 'limited stock');
      mock.restore();
    });
  });
  describe('When passed an Id that is out of stock', () => {
    it('should return Backordered', async() => {
      const mock = new MockAdapter(axios);
      const data = {
        G1234567: ['', '', 0.0],
      };
      const itemId = 'G1234567';

      mock.onPost('/* removed */', {[itemId]: ''})
        .reply(200, data);
      const result = await availabilityServiceMock.getAvailability(itemId);
      assert(result === 'backordered');
      mock.restore();
    });
  });
  describe('When the post request fails', () => {
    it('should throw an error', async() => {
      const mock = new MockAdapter(axios);
      const data = {stuff: 'stuff'};

      try {
        mock.onPost('/* removed */').reply(500, data);
        await availabilityServiceMock.getAvailability('thingy');
        throw new Error('wrongError');
      } catch (error) {
        assert(error instanceof ErrorService && error.name === 'API_FAILURE Error');
        mock.restore();
      }
    });
  });
});
