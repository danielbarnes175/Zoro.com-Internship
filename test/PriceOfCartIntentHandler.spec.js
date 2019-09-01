const index = require('../index.js');
const alexaTest = require('alexa-skill-test-framework');
const customNock = require('../resources/nockAlexaAPI.js');

alexaTest.initialize(
  index,
  '/* removed */',
  'amzn1.ask.account.VOID');

describe('PriceOfCartIntentHandler', () => {
  describe(' Without access to the user\'s list', () => {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('PriceOfCartIntent'),
        says: 'I don\'t have permission to access your shopping lists. I\'ve sent a card to your Amazon Alexa app where you can update those permissions. Once you have done this, please ask for shopping list again.',
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  describe(`Reading an empty list`, () => {
    beforeEach(() => {
      customNock.nockAccessList('empty');
    });
  
    afterEach(() => {
      customNock.cleanAll();
    });

    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('PriceOfCartIntent'),
        says: `You have no items in your Zoro shopping cart. You can add an item to the cart by saying "add <break time = "0.2s"/> quantity <break time = "0.2s"/> of <break time = "0.2s"/> result number <break time = "0.2s"/> to the cart".`,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  describe('Reading a list with one item', () => {
    beforeEach(() => {
      customNock.nockAccessList('oneItem');
    });
  
    afterEach(() => {
      customNock.cleanAll();
    });

    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('PriceOfCartIntent'),
        says: 
          `The total price of your cart is $1.00 excluding shipping and tax.`,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  describe('Reading a list with items that are formatted incorrectly', () => {
    beforeEach(() => {
      customNock.nockAccessList('invalidItems');
    });
  
    afterEach(() => {
      customNock.cleanAll();
    });
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('PriceOfCartIntent'),
        says: `You have no recognizable Zoro products in your Zoro shopping cart. You can add an item to the cart by saying "add <break time = "0.2s"/> quantity <break time = "0.2s"/> of <break time = "0.2s"/> result number <break time = "0.2s"/> to the cart".`,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
});
