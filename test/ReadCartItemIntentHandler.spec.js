const index = require('../index.js');
const alexaTest = require('alexa-skill-test-framework');

// for nock
const customNock = require('../resources/nockAlexaAPI.js');

// initialize the testing framework
alexaTest.initialize(
  index,
  '/* removed */',
  'amzn1.ask.account.VOID');
// disable question mark checking, which is enabled by default if using withSessionAttributes
alexaTest.setExtraFeature('questionMarkCheck', false);


describe('ReadCartItemIntentHandler', () => {
  describe(`Reading without access to user's list`, () => {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('ReadCartItemIntent'),
        says: `I don't have permission to access your shopping lists. I've sent a card to your Amazon Alexa app where you can update those permissions. Once you have done this, please ask for shopping list again.`,
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
        request: alexaTest.getIntentRequest('ReadCartItemIntent'),
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
        request: alexaTest.getIntentRequest('ReadCartItemIntent'),
        says: 
          `In your Zoro Shopping Cart, you have:\n` 
          + `<break time = "0.5s"/> 2 <break time = "0.2s"/> Shockwave™ 2" Impact Phillips #2 Power Insert Bits, 15 pk..\n`
          + `<break time = "0.5s"/> You can receive an email with a link to the cart by saying <break time = ".2s"/> "send me the cart link."`,
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
        request: alexaTest.getIntentRequest('ReadCartItemIntent'),
        says: `You have no items in your Zoro shopping cart. You can add an item to the cart by saying "add <break time = "0.2s"/> quantity <break time = "0.2s"/> of <break time = "0.2s"/> result number <break time = "0.2s"/> to the cart".`,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
});
