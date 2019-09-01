const index = require('../index.js');
const alexaTest = require('alexa-skill-test-framework');

// for mocking
const customNock = require('../resources/nockAlexaAPI.js');

// initialize the testing framework
alexaTest.initialize(
  index,
  '/* removed */',
  'amzn1.ask.account.VOID');
// disable question mark checking
alexaTest.setExtraFeature('questionMarkCheck', false);


// Testing the Clear Cart Handler
describe('ClearCartIntentHandler', () => {
  describe(`Clearing without access to user's list`, () => {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('ClearCartIntent'),
        says: `I don't have permission to access your shopping lists. I've sent a card to your Amazon Alexa app where you can update those permissions. Once you have done this, please ask for shopping list again.`,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  describe('Clearing an empty list', () => {
    beforeEach(() => {
      customNock.nockAccessList('empty');
    });
  
    afterEach(() => {
      customNock.cleanAll();
    });

    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('ClearCartIntent'),
        says: `You have no items in your Zoro shopping cart. You can add an item to the cart by saying "add <break time = "0.2s"/> quantity <break time = "0.2s"/> of <break time = "0.2s"/> result number <break time = "0.2s"/> to the cart".`,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
  
  describe('Clearing a list with one item', () => {
    beforeEach(() => {
      customNock.nockAccessList('oneItem');
    });
  
    afterEach(() => {
      customNock.cleanAll();
    });

    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('ClearCartIntent'),
        says: `Successfully cleared your Zoro shopping cart.`,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
});
