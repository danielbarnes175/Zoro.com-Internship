const index = require('../index.js');
const alexaTest = require('alexa-skill-test-framework');
const emailService = require('../services/EmailService.js');
const assert = require('assert');

// nock
const customNock = require('../resources/nockAlexaAPI.js');
// mock-axios
const mockAxios = require('../resources/mockAxiosCalls');
// fixtures
const mockData = require('../resources/mockTestDataFixture.js');
const {products, searchTerms} = require('../resources/sessionAttributesFixture.js');
const htmlData = require('../resources/SendEmailIntentHandler.spec.html-data.js');

const {cartLinkEmail} = htmlData;

// initialize the testing framework
alexaTest.initialize(
  index,
  '/* removed */',
  'amzn1.ask.account.VOID');
// disable question mark checking, which is enabled by default if using withSessionAttributes
alexaTest.setExtraFeature('questionMarkCheck', false);

// Setup for the test that test confirmation denied status
const deniedRequest = alexaTest.getIntentRequest('GetCartLinkIntent', mockData.CART_SLOTS.firstItem);


describe('GetCartLinkHandler', () => {
  describe('When requesting with slots but without searching an item', () => {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('GetCartLinkIntent', mockData.CART_SLOTS.firstItem),
        says: 'Please search for an item first so that the cart link can be sent to your email.',
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  describe(`When invalid slot value of qty`, () => {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('GetCartLinkIntent', mockData.CART_SLOTS.secondItem),
        says: `You can only add a multiple of 4 numbers of the selected item to the cart. Please tell me another quantity number, such as <break time = "0.2s"/> "ten".`,
        repromptsNothing: false,
        shouldEndSession: false,
        withSessionAttributes: {
          searchTerm: searchTerms.hammers,
          products: products.hammers,
        },
      },
    ]);
  });

  describe(`When accessing list without permission`, () => {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('GetCartLinkIntent', mockData.CART_SLOTS.empty),
        says: `I don't have permission to access your shopping lists. I've sent a card to your Amazon Alexa app where you can update those permissions. Once you have done this, please ask for shopping list again.`,
        repromptsNothing: false,
        shouldEndSession: false,
        withSessionAttributes: {
          searchTerm: searchTerms.hammers,
          products: products.hammers,
        },
      },
    ]);
  });


  describe('When successfully:', () => {
    let mock;
    beforeEach(() => {
      customNock.nockAccessList('empty');
      mock = mockAxios.mockGetEmail();
    });

    afterEach(() => {
      customNock.cleanAll();
      mockAxios.cleanMock(mock);
    });

    describe('getting cart link of what specified by slots', () => {
      alexaTest.test([
        {
          request: alexaTest.getIntentRequest('GetCartLinkIntent', mockData.CART_SLOTS.firstItem),
          says: `I sent the link to the shopping cart with 3 Hammer, Rip Claw, 16 oz., 12" L to your email.`,
          repromptsNothing: false,
          shouldEndSession: false,
          withSessionAttributes: {
            searchTerm: searchTerms.hammers,
            products: products.hammers,
          },
        },
      ]);
    });

    describe('getting cart link based on an empty list', () => {
      alexaTest.test([
        {
          request: alexaTest.getIntentRequest('GetCartLinkIntent', mockData.CART_SLOTS.empty),
          says: `You have no items in your Zoro shopping cart. You can add an item to the cart by saying "add <break time = "0.2s"/> quantity <break time = "0.2s"/> of <break time = "0.2s"/> result number <break time = "0.2s"/> to the cart".`,
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

  describe('When the list has one item', () => {
    let mock;
    beforeEach(() => {
      customNock.nockAccessList('oneItem');
      mock = mockAxios.mockGetEmail();
    });

    afterEach(() => {
      customNock.cleanAll();
      mockAxios.cleanMock(mock);
    });

    describe('  successfully getting cart link', () => {
      alexaTest.test([
        {
          request: alexaTest.getIntentRequest('GetCartLinkIntent', mockData.CART_SLOTS.empty),
          says: `I have sent the Zoro shopping cart link to your email.`,
          repromptsNothing: false,
          shouldEndSession: false,
          withSessionAttributes: {
            searchTerm: searchTerms.hammers,
            products: products.hammers,
          },
        },
      ]);
    });

    describe('  denying the request as the slots provided are not confirmed', () => {
      before(() => {
        deniedRequest.request.intent.confirmationStatus = 'DENIED';
        deniedRequest.request.dialogState = 'COMPLETED';
      });

      alexaTest.test([
        {
          request: deniedRequest,
          says: `The action was canceled.`,
          repromptsNothing: false,
          shouldEndSession: false,
          withSessionAttributes: {
            searchTerm: searchTerms.hammers,
            products: products.hammers,
          },
        },
      ]);
    });
    
    describe('  the request is unconfirmed', () => {
      before(() => {
        deniedRequest.request.intent.confirmationStatus = 'NONE';
        deniedRequest.request.dialogState = '';
      });

      alexaTest.test([
        {
          request: deniedRequest,
          says: `Are you sure that you would like to send a link to a cart with ${mockData.CART_SLOTS.firstItem.itemQty} of result number ${mockData.CART_SLOTS.firstItem.itemNum}?`,
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

  describe('Getting link to a cart with items that are formatted incorrectly', () => {
    let mock;
    beforeEach(() => {
      customNock.nockAccessList('invalidItems');
      mock = mockAxios.mockGetEmail();
    });

    afterEach(() => {
      customNock.cleanAll();
      mockAxios.cleanMock(mock);
    });

    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('GetCartLinkIntent', mockData.CART_SLOTS.empty),
        says: `You have no recognizable Zoro products in your Zoro shopping cart. You can add an item to the cart by saying "add <break time = "0.2s"/> quantity <break time = "0.2s"/> of <break time = "0.2s"/> result number <break time = "0.2s"/> to the cart".`,
        repromptsNothing: false,
        shouldEndSession: false,
        withSessionAttributes: {
          searchTerm: searchTerms.hammers,
          products: products.hammers,
        },
      },
    ]);
  });

  describe('parseEmailCartLink()', () => {
    describe('when the data is valid', () => {
      it(' should pass when the parsed email html/css correctly matches the mock data', () => {
        assert.equal(
          (emailService.parseEmailCartLink(mockData.CART_LIST).replace(/\s*/g, '')),
          cartLinkEmail.replace(/\s*/g, ''));
      });
    });
  });
});
