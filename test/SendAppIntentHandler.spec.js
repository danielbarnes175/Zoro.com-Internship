const index = require('../index.js');
const alexaTest = require('alexa-skill-test-framework');

// initialize the testing framework
alexaTest.initialize(
  index,
  '/* removed */',
  'amzn1.ask.account.VOID');
// disable question mark checking, which is enabled by default if using withSessionAttributes
alexaTest.setExtraFeature('questionMarkCheck', false);

// fixtures
const {products, searchTerms} = require('../resources/sessionAttributesFixture.js');

describe('SendAppIntentHandler', () => {
  alexaTest.test([
    {
      request: alexaTest.getIntentRequest('SendAppIntent'),
      says: 'Please search for an item first!',
      repromptsNothing: false,
      shouldEndSession: false,
    },
  ]);

  alexaTest.test([
    {
      request: alexaTest.getIntentRequest('SendAppIntent'),
      says: `You can check the search results of "${searchTerms.hammers}" on your Alexa app now. Thank you for searching Zoro.com!`,
      withSessionAttributes: {
        searchTerm: searchTerms.hammers,
        products: products.hammers,
      },
      repromptsNothing: false,
      shouldEndSession: false,
      hasCardTitle: `Zoro Search Results of "${searchTerms.hammers}"`,
    },
  ]);
});
