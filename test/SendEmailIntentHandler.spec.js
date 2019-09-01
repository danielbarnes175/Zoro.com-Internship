const index = require('../index.js');
const alexaTest = require('alexa-skill-test-framework');
const assert = require('assert');
const commonTags = require('common-tags');

const htmlData = require('../resources/SendEmailIntentHandler.spec.html-data.js');
const {products, searchTerms} = require('../resources/sessionAttributesFixture.js');

const emailService = require('../services/EmailService.js');
const ErrorService = require('../services/ErrorService.js');

const {searchResultsEmail} = htmlData;

// for mocking axios
const mockAxios = require('../resources/mockAxiosCalls');

// initialize the testing framework
alexaTest.initialize(
  index,
  '/* removed */',
  'amzn1.ask.account.VOID');
// disable question mark checking, which is enabled by default if using withSessionAttributes
alexaTest.setExtraFeature('questionMarkCheck', false);


describe('SendEmailIntentHandler without permission', () => {
  describe('Requesting for email without searching an item beforehand', () => {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('SendEmailIntent'),
        says: 'Please search for an item first!',
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  describe(`Requesting for email without permission to access user's email`, () => {
    const myError = new ErrorService('VIEW_EMAIL');
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('SendEmailIntent'),
        says: myError.speak,
        repromptsNothing: false,
        shouldEndSession: false,
        withSessionAttributes: {
          searchTerm: searchTerms.hammers,
          products: products.hammers,
        },
      },
    ]);
  });
});

describe('SendEmailIntentHandler with permission', () => {
  describe(`Requesting for email with search results of ${searchTerms.hammers}`, () => {
    let mock;
    beforeEach(() => {
      mock = mockAxios.mockGetEmail();
    });

    afterEach(() => {
      mockAxios.cleanMock(mock);
    });

    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('SendEmailIntent'),
        says: `I sent the search results of "${searchTerms.hammers}" to your email.`,
        repromptsNothing: false,
        shouldEndSession: false,
        withSessionAttributes: {
          searchTerm: searchTerms.hammers,
          products: products.hammers,
        },
      },
    ]);
  });

  describe('parseEmail', () => {
    it(' should pass when the parsed email correctly matches the data', () => {
      assert.equal(
        emailService.parseEmailSearchResults(products.drills, 'drills').replace(/\s*/g, ''),
        searchResultsEmail.replace(/\s*/g, ''),
      );
    });
  });
});
