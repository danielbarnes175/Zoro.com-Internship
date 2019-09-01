const index = require('../index.js');
const alexaTest = require('alexa-skill-test-framework');

// for mocking
const customNock = require('../resources/nockAlexaAPI.js');

// fixtures
const mockData = require('../resources/mockTestDataFixture.js');
const {products, searchTerms} = require('../resources/sessionAttributesFixture.js');

// initialize the testing framework
alexaTest.initialize(
  index,
  '/* removed */',
  'amzn1.ask.account.VOID');
// disable question mark checking, which is enabled by default if using withSessionAttributes
alexaTest.setExtraFeature('questionMarkCheck', false);

// Setup for the test that test confirmation denied status
const deniedRequest = alexaTest.getIntentRequest('AddCartItemIntent', mockData.CART_SLOTS.firstItem);


describe('AddCartItemIntentHandler', () => {
  describe('When requesting without searching an item', () => {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('AddCartItemIntent', mockData.CART_SLOTS.firstItem),
        says: 'Please search for an item first so that the search results can be added to your cart.',
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  describe(`When invalid slot value:`, () => {
    describe(`qty is not a multiple of minOrderQty`, () => {
      alexaTest.test([
        {
          request: alexaTest.getIntentRequest('AddCartItemIntent', mockData.CART_SLOTS.secondItem),
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
    describe(`qty exceeds 10000`, () => {
      alexaTest.test([
        {
          request: alexaTest.getIntentRequest('AddCartItemIntent', mockData.CART_SLOTS.hugeQty),
          says: `Sorry, the quantity must be less than ten thousand. How many of the selected item would you like?`,
          repromptsNothing: false,
          shouldEndSession: false,
          withSessionAttributes: {
            searchTerm: searchTerms.hammers,
            products: products.hammers,
          },
        },
      ]);
    });
    describe(`qty is undefined`, () => {
      alexaTest.test([
        {
          request: alexaTest.getIntentRequest('AddCartItemIntent', mockData.CART_SLOTS.noQty),
          says: 'How many of the selected item do you want to add to your cart? Please tell me the quantity number, such as <break time = "0.2s"/> "ten".',
          repromptsNothing: false,
          shouldEndSession: false,
          withSessionAttributes: {
            searchTerm: searchTerms.hammers,
            products: products.hammers,
          },
        },
      ]);
    });
    describe(`item number is out of range of search results`, () => {
      alexaTest.test([
        {
          request: alexaTest.getIntentRequest('AddCartItemIntent', mockData.CART_SLOTS.invalidItemNum),
          says: 'Please only select an item from the search results to add to the cart. Please tell me the result number from the list, such as <break time = "0.2s"/> "one".',
          repromptsNothing: false,
          shouldEndSession: false,
          withSessionAttributes: {
            searchTerm: searchTerms.hammers,
            products: products.hammers,
          },
        },
      ]);
    });
    describe(`all undefined`, () => {
      alexaTest.test([
        {
          request: alexaTest.getIntentRequest('AddCartItemIntent', mockData.CART_SLOTS.empty),
          says: 'Which item do you want to add to your cart? Please tell me the result number from the list, such as <break time = "0.2s"/> "one".',
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

  describe(`When without permission to access user's email`, () => {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('AddCartItemIntent', mockData.CART_SLOTS.firstItem),
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


  describe('When adding to a list with one item:', () => {
    beforeEach(() => {
      customNock.nockAccessList('oneItem');
    });

    afterEach(() => {
      customNock.cleanAll();
    });

    describe('should successfully add another item', () => {
      alexaTest.test([
        {
          request: alexaTest.getIntentRequest('AddCartItemIntent', mockData.CART_SLOTS.firstItem),
          says: `Successfully added 3 <break time = "0.5s"/> "${products.hammers[0].itemTitle}" to your shopping cart. You can receive an email with the link to the cart by saying <break time = "0.2s"/> "send me the cart link" <break time = "0.2s"/> or I can read what's in your cart by saying <break time = "0.2s"/> "what's in my cart".`,
          repromptsNothing: false,
          shouldEndSession: false,
          withSessionAttributes: {
            searchTerm: searchTerms.hammers,
            products: products.hammers,
          },
        },
      ]);
    });

    describe('should update quantity of item one by adding duplicate item', () => {
      alexaTest.test([
        {
          request: alexaTest.getIntentRequest('AddCartItemIntent', mockData.CART_SLOTS.firstItem),
          says: `${products.screwdriver[0].itemTitle} is already in the list, so I updated its quantity to 3. You can receive an email with the link to the cart by saying <break time = "0.2s"/> "send me the cart link" <break time = "0.2s"/> or I can read what's in your cart by saying <break time = "0.2s"/> "what's in my cart".`,
          repromptsNothing: false,
          shouldEndSession: false,
          withSessionAttributes: {
            searchTerm: searchTerms.screwdriver,
            products: products.screwdriver,
          },
        },
      ]);
    });

    describe(`should add an item with long name`, () => {
      alexaTest.test([
        {
          request: alexaTest.getIntentRequest('AddCartItemIntent', mockData.CART_SLOTS.firstItem),
          says: `Successfully added 3 <break time = "0.5s"/> "${products.test[0].itemTitle}" to your shopping cart. You can receive an email with the link to the cart by saying <break time = "0.2s"/> "send me the cart link" <break time = "0.2s"/> or I can read what's in your cart by saying <break time = "0.2s"/> "what's in my cart".`,
          repromptsNothing: false,
          shouldEndSession: false,
          withSessionAttributes: {
            searchTerm: searchTerms.test,
            products: products.test,
          },
        },
      ]);
    });

    describe('should deny the request as the slots provided are not confirmed', () => {
      before(() => {
        deniedRequest.request.intent.confirmationStatus = 'DENIED';
        deniedRequest.request.dialogState = 'COMPLETED';
      });
      
      alexaTest.test([
        {
          request: deniedRequest,
          says: `The action was canceled. You can retry adding an item to the cart by saying: "add <break time = "0.2s"/> quantity <break time = "0.2s"/> of <break time = "0.2s"/> result number <break time = "0.2s"/> to the cart".`,
          repromptsNothing: false,
          shouldEndSession: false,
          withSessionAttributes: {
            searchTerm: searchTerms.hammers,
            products: products.hammers,
          },
        },
      ]);
    });
    
    describe('should ask for confirmation of the request', () => {
      before(() => {
        deniedRequest.request.intent.confirmationStatus = 'NONE';
        deniedRequest.request.dialogState = '';
      });

      alexaTest.test([
        {
          request: deniedRequest,
          says: `Are you sure that you would like to add ${mockData.CART_SLOTS.firstItem.itemQty} of result number ${mockData.CART_SLOTS.firstItem.itemNum} to your cart?`,
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

  describe('When adding without having a zoro shopping list', () => {
    beforeEach(() => {
      customNock.nockAccessList('oneItem', 'wrongListName');
    });

    afterEach(() => {
      customNock.cleanAll();
    });

    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('AddCartItemIntent', mockData.CART_SLOTS.firstItem),
        says: `Successfully added 3 <break time = "0.5s"/> "${products.hammers[0].itemTitle}" to your shopping cart. You can receive an email with the link to the cart by saying <break time = "0.2s"/> "send me the cart link" <break time = "0.2s"/> or I can read what's in your cart by saying <break time = "0.2s"/> "what's in my cart".`,
        repromptsNothing: false,
        shouldEndSession: false,
        withSessionAttributes: {
          searchTerm: searchTerms.hammers,
          products: products.hammers,
        },
      },
    ]);
  });

  describe('When adding to empty list', () => {
    beforeEach(() => {
      customNock.nockAccessList('empty');
    });

    afterEach(() => {
      customNock.cleanAll();
    });

    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('AddCartItemIntent', mockData.CART_SLOTS.firstItem),
        says: `Successfully added 3 <break time = "0.5s"/> "${products.hammers[0].itemTitle}" to your shopping cart. You can receive an email with the link to the cart by saying <break time = "0.2s"/> "send me the cart link" <break time = "0.2s"/> or I can read what's in your cart by saying <break time = "0.2s"/> "what's in my cart".`,
        repromptsNothing: false,
        shouldEndSession: false,
        withSessionAttributes: {
          searchTerm: searchTerms.hammers,
          products: products.hammers,
        },
      },
    ]);
  });

  describe('When adding to empty list', () => {
    beforeEach(() => {
      customNock.nockGetListWithError();
    });

    afterEach(() => {
      customNock.cleanAll();
    });

    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('AddCartItemIntent', mockData.CART_SLOTS.firstItem),
        says: `Something went wrong. Please try again.`,
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
