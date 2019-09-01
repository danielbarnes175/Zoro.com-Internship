const index = require('../index.js');
const alexaTest = require('alexa-skill-test-framework');

// initialize the testing framework
alexaTest.initialize(
  index,
  '/* removed */',
  'amzn1.ask.account.VOID');

const itemIdx = [{number: 1}, {number: 7}, {number: 'yes'}, {number: -1}, {number: '', ordinal: 1}];
const searchTerm = ['hammers'];
const body = /* removed */;
const cost = /* removed */;
const products = [
 /* removed */
];

describe('PriceInfoIntentHandler', () => {
  describe('Hammer Info', () => {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('PriceInfoIntent', itemIdx[0]),
        says: `Item 1 costs $${cost}.`,
        withSessionAttributes: {
          searchTerm: searchTerm[0],
          products: products[0],
        },
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  describe('Number too big', () => {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('PriceInfoIntent', itemIdx[1]),
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
        request: alexaTest.getIntentRequest('PriceInfoIntent', itemIdx[0]),
        says: 'Please search for an item first!',
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  describe('Hammer Info with ordinal slot', () => {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('PriceInfoIntent', itemIdx[4]),
        says: `Item 1 costs $${cost}.`,
        withSessionAttributes: {
          searchTerm: searchTerm[0],
          products: products[0],
        },
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  describe('When no search results', () => {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('PriceInfoIntent', itemIdx[4]),
        says: `I cannot find any search results of "hammers". I'm sorry. Please search for another item by saying: "Search for drills".`,
        withSessionAttributes: {
          searchTerm: searchTerm[0],
          products: products[1],
        },
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
});
