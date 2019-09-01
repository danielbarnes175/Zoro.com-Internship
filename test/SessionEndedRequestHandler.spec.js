const index = require('../index.js');
const alexaTest = require('alexa-skill-test-framework');

// initialize the testing framework
alexaTest.initialize(
  index,
  '/* removed */',
  'amzn1.ask.account.VOID');

// Testing the SessionEndedRequestHandler
describe('SessionEndedRequest', () => {
  alexaTest.test([
    {
      request: alexaTest.getSessionEndedRequest('USER_INITIATED'),
      says: 'Thank you for using the Zoro search interface. Goodbye!',
      repromptNothing: true,
      shouldEndSession: true,
    },
  ]);
});
