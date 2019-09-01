const index = require('../index.js');
const alexaTest = require('alexa-skill-test-framework');

// initialize the testing framework
alexaTest.initialize(
  index,
  '/* removed */',
  'amzn1.ask.account.VOID');

describe('CancelAndStopIntent', () => {
  describe('When the Cancel intent is passed to the handler', () => {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('AMAZON.CancelIntent'),
        says: 'Thank you for using the Zoro search interface. Goodbye!',
        repromptsNothing: true,
        shouldEndSession: true,
      },
    ]);
  });
  describe('When the Stop intent is passed to the handler', () => {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('AMAZON.StopIntent'),
        says: 'Thank you for using the Zoro search interface. Goodbye!',
        repromptsNothing: true,
        shouldEndSession: true,
      },
    ]);
  });
});
