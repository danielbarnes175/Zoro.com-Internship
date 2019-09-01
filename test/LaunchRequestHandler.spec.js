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
describe('LaunchRequest', () => {
  alexaTest.test([
    {
      request: alexaTest.getLaunchRequest(),
      says: 'Welcome to Zoro.com! You can search for an item by keyword or Zoro number. For example: <break time=".2s" /> Search for drills"',
      repromptsNothing: false,
      shouldEndSession: false,
    },
  ]);
});
