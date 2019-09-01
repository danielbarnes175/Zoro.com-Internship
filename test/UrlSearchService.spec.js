const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const SearchService = require('../services/UrlSearchService.js');
const assert = require('assert');
const fixtureData = require('../resources/urlSearchServiceFixture.js');

const {URLS} = fixtureData;
const {URL_ONE_DATA} = fixtureData;
const {URL_TWO_DATA} = fixtureData;

describe('stripFiller method', () => {
  it('should get rid of any filler words from the provided string', () => {
    const searchTerm = 'take who cheerios who with you';
    assert('cheerios' === SearchService.stripFiller(searchTerm));
  });
});
describe('getSearchResults', () => {
  describe('When the method is passed valid data', () => {
    it('should return an item and its information', async() => {
      const mock = new MockAdapter(axios);
      const data = URL_ONE_DATA[0];

      mock.onGet(URLS[0]).reply(200, data);
      const products = await SearchService.getSearchResults('cheerios');
      assert(products[0].itemTitle === 'A thousand cheerios');
      mock.restore();
    });
  });
  describe('When the request fails', () => {
    it('should throw an error', async() => {
      const mock = new MockAdapter(axios);
      const data = {stuff: 'stuff'};

      try {
        mock.onGet(URLS[0]).reply(500, data);
        await SearchService.getSearchResults('drills');
        throw new Error('wrongError');
      } catch (error) {
        assert(error instanceof Error && error.message !== 'wrongError');
        mock.restore();
      }
    });
  });
});
