const index = require('../index.js');
const alexaTest = require('alexa-skill-test-framework');

// initialize the testing framework
alexaTest.initialize(
  index,
  '/* removed */',
  'amzn1.ask.account.VOID');
const body = /* removed */;
const productInfo = /* removed */;
const productInfoSansFeatures = /* removed */;
const itemIdx = /* removed */;
const searchTerm = /* removed */;
const products = [
  /* removed */
];

// mock product info API
const MockAdapter = require('axios-mock-adapter');
const axios = require('axios');
const productAPIResponse = [
  /* removed */
];

function constructSentence(body1, body2) {
  const name = /* removed */;
  const cost = /* removed */;
  let description = body2.products[0].attributes.find(attr => attr.name === 'Features');
  if (description !== undefined) {
    description = `${description.value.replace(/\s{0,1}&\s{0,1}/g, ' and ')}. `;
  } else {
    description = ``;
  }
  return `Number 1: <break time = ".5s"/>${name}. It costs: $${cost}. ${description}The minimum order quantity is 1 and it's backordered.`;
}

describe('ItemInfoIntent', () => {
  describe('Hammer Info with number slot', () => {
    const sentenceActual = constructSentence(body, productInfo);
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('ItemInfoIntent', itemIdx[0]),
        says: sentenceActual,
        withSessionAttributes: {
          searchTerm: searchTerm[0],
          products: products[0],
        },
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  describe('Hammer Info with number slot, no description', () => {
    const sentenceActual = constructSentence(body, productInfoSansFeatures);
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('ItemInfoIntent', itemIdx[0]),
        says: sentenceActual,
        withSessionAttributes: {
          searchTerm: searchTerm[0],
          products: products[1],
        },
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  describe('Number too big', () => {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('ItemInfoIntent', itemIdx[1]),
        says: 'Sorry, that is not a valid result number. Please choose the result number from the list or say <break time = ".2s"/> "more information" <break time = ".2s"/> to hear the list again.',
        withSessionAttributes: {
          searchTerm: searchTerm[0],
          products: products[0],
        },
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  describe('Number is not a number', () => {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('PriceInfoIntent', itemIdx[2]),
        says: 'Sorry, that is not a valid result number. Please choose the result number from the list or say <break time = ".2s"/> "more information" <break time = ".2s"/> to hear the list again.',
        withSessionAttributes: {
          searchTerm: searchTerm[0],
          products: products[0],
        },
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  describe('Number is less than one', () => {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('PriceInfoIntent', itemIdx[3]),
        says: 'Sorry, that is not a valid result number. Please choose the result number from the list or say <break time = ".2s"/> "more information" <break time = ".2s"/> to hear the list again.',
        withSessionAttributes: {
          searchTerm: searchTerm[0],
          products: products[0],
        },
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  describe('No item searched', () => {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('ItemInfoIntent', itemIdx[0]),
        says: 'Please search for an item first!',
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  describe('Hammer Info with ordinal slot', () => {
    const sentenceActual = constructSentence(body, productInfo);
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('ItemInfoIntent', itemIdx[4]),
        says: sentenceActual,
        withSessionAttributes: {
          searchTerm: searchTerm[0],
          products: products[0],
        },
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  let mock;
  describe('Hammer Info when minOrderQty and description are not cached in sessionAttributes', () => {
    beforeEach(() => {
      mock = new MockAdapter(axios);
      mock
        .onGet(`https://www.zoro.com/product?products=${products[2][0].itemID}`)
        .reply(200, productAPIResponse[0])
        .onGet(`https://www.zoro.com/product?products=${products[3][0].itemID}`)
        .reply(200, productAPIResponse[1]);
    });

    afterEach(() => {
      mock.restore();
    });
    describe('  and minOrderQty and description are provided', () => {
      alexaTest.test([
        {
          request: alexaTest.getIntentRequest('ItemInfoIntent', itemIdx[4]),
          says: 'Number 1: <break time = ".5s"/>Hammer, Rip Claw, 16 oz., 12" L. It costs: $10.15. Test for caching product info API response. The minimum order quantity is 9999 and it\'s backordered.',
          withSessionAttributes: {
            searchTerm: searchTerm[0],
            products: products[2],
          },
          repromptsNothing: false,
          shouldEndSession: false,
        },
      ]);
    });

    describe('  and minOrderQty and description are not provided but zoroOrderQty is', () => {
      alexaTest.test([
        {
          request: alexaTest.getIntentRequest('ItemInfoIntent', itemIdx[4]),
          says: 'Number 1: <break time = ".5s"/>Hammer, Rip Claw, 16 oz., 12" L. It costs: $10.15. The minimum order quantity is 9999 and it\'s backordered.',
          withSessionAttributes: {
            searchTerm: searchTerm[0],
            products: products[3],
          },
          repromptsNothing: false,
          shouldEndSession: false,
        },
      ]);
    });

    
    describe('  and the caching fails', () => {
      alexaTest.test([
        {
          request: alexaTest.getIntentRequest('ItemInfoIntent', itemIdx[4]),
          says: 'Something went wrong. Please try again.',
          withSessionAttributes: {
            searchTerm: searchTerm[0],
            products: products[4],
          },
          repromptsNothing: false,
          shouldEndSession: false,
        },
      ]);
    });
  });
});
