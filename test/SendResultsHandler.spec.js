const index = require('../index.js');
const alexaTest = require('alexa-skill-test-framework');

// initialize the testing framework
alexaTest.initialize(
  index,
  '/* removed */',
  'amzn1.ask.account.VOID');

// Disabling the testing framework's condition that a request that doesn't end
// a session must have a question mark. Reason: Doesn't make sense in our
// conversation diagram with how it's currently written.
alexaTest.setExtraFeature('questionMarkCheck', false);

// Testing the LaunchRequestHandler
describe('SendResultsIntentRequest', () => {
  alexaTest.test([
    {
      request: alexaTest.getIntentRequest('SendResultsIntent'),
      says: 'I can send you the results either by the Alexa App, or an email. Additionally, I can read off the results to you.',
      repromptsNothing: false,
      shouldEndSession: false,
    },
  ]);
});
