const index = require('../index.js');
const alexaTest = require('alexa-skill-test-framework');

// initialize the testing framework
alexaTest.initialize(
  index,
  '/* removed */',
  'amzn1.ask.account.VOID');

// Testing the MessageHandler
describe('MessageHandler', () => {
  alexaTest.test([
    {
      request: alexaTest.getIntentRequest('SendTextIntent'),
      say: 'Sent you a message. Thank you for searching Zoro.com!',
      repromptNothing: false,
      shouldEndSession: false,
    },
  ]);
});
