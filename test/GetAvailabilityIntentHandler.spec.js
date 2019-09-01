const index = require('../index.js');
const alexaTest = require('alexa-skill-test-framework');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const ErrorService = require('../services/ErrorService.js');

// initialize the testing framework
alexaTest.initialize(
  index,
  'amzn1.ask.skill.232871d9-d0a7-4b75-b53e-8f1044bfeb90',
  'amzn1.ask.account.VOID');
// disable question mark checking, which is enabled by default if using withSessionAttributes
alexaTest.setExtraFeature('questionMarkCheck', false);

const itemIdx = [{number: 1}, {number: 2}, {number: 7}, {number: 'yes'}, {number: -1}, {number: '', ordinal: 1}, {number: 4}, {number: 5}];
const data = [
  {G1234567: ['', '', 2134.0]},
  {G1111111: ['', '', 4.0]},
  {G2222222: ['', '', 'N/A']},
  {G3333333: ['', '', 0.0]},
];
const array = [
  {
    itemTitle: 'A million dollar lathe',
    itemID: 'G1234567',
  },
  {
    itemTitle: 'Giant rubber ducky',
    itemID: 'G1111111',
  },
  {
    itemTitle: 'Poisonous banana slugs',
    itemID: 'G2222222',
  },
  {
    itemTitle: 'Godzilla body pillow',
    itemID: 'G3333333',
  },
  {
    itemTitle: 'The failing product',
    itemID: 'G2345678',
  },
];

let mock;

describe('GetAvailabilityIntentHandler', () => {
  beforeEach(() => {
    mock = new MockAdapter(axios);
    mock.onPost('/* removed */', {G1234567: ''}).reply(200, data[0])
      .onPost('/* removed */', {G1111111: ''}).reply(200, data[1])
      .onPost('/* removed */', {GG2222222: ''})
      .reply(200, data[2])
      .onPost('/* removed */', {G3333333: ''})
      .reply(200, data[3])
      .onPost('/* removed */', {G2345678: ''})
      .reply(500, data[0])
      .onPost('/* removed */', {G3456789: ''})
      .reply(200, data);
  });
  afterEach(() => {
    mock.restore();
  });

  describe('When the request returns in stock', () => {
    alexaTest.test([
      {
        withSessionAttributes: {
          products: array,
        },
        request: alexaTest.getIntentRequest('GetAvailabilityIntent', itemIdx[0]),
        says: `Item 1 is currently in stock`,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  describe('When the request returns limited stock', () => {
    alexaTest.test([
      {
        withSessionAttributes: {
          products: array,
        },
        request: alexaTest.getIntentRequest('GetAvailabilityIntent', itemIdx[1]),
        says: `Item 2 is currently limited stock`,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  describe('No item searched', () => {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('GetAvailabilityIntent', itemIdx[0]),
        says: 'Please search for an item first!',
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });


  describe('Number too big', () => {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('GetAvailabilityIntent', itemIdx[2]),
        says: 'Sorry, that is not a valid result number. Please choose the result number from the list or say <break time = ".2s"/> "more information" <break time = ".2s"/> to hear the list again.',
        withSessionAttributes: {
          products: array,
        },
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });


  describe('Number is less than one', () => {
    alexaTest.test([
      {

        request: alexaTest.getIntentRequest('GetAvailabilityIntent', itemIdx[4]),
        says: 'Sorry, that is not a valid result number. Please choose the result number from the list or say <break time = ".2s"/> "more information" <break time = ".2s"/> to hear the list again.',
        withSessionAttributes: {
          products: array,
        },
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  describe('Number is not a number', () => {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('GetAvailabilityIntent', itemIdx[3]),
        says: 'Sorry, that is not a valid result number. Please choose the result number from the list or say <break time = ".2s"/> "more information" <break time = ".2s"/> to hear the list again.',
        withSessionAttributes: {
          products: array,
        },
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  describe('When the request returns data', () => {
    alexaTest.test([
      {
        withSessionAttributes: {
          products: array,
        },
        request: alexaTest.getIntentRequest('GetAvailabilityIntent', itemIdx[5]),
        says: `Item 1 is currently in stock`,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  describe('When the request returns backordered', () => {
    alexaTest.test([
      {
        withSessionAttributes: {
          products: array,
        },
        request: alexaTest.getIntentRequest('GetAvailabilityIntent', itemIdx[6]),
        says: `Item 4 is currently backordered`,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  describe('When the request fails', () => {
    const myError = new ErrorService('API_FAILURE');
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('GetAvailabilityIntent', itemIdx[7]),
        says: myError.speak,
        withSessionAttributes: {
          products: array,
        },
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
});

