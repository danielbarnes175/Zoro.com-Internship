const index = require('../index.js');
const alexaTest = require('alexa-skill-test-framework');

// initialize the testing framework
alexaTest.initialize(
  index,
  '/* removed */',
  'amzn1.ask.account.VOID');

describe('HelpIntent', () => {
  const speechText = `Welcome to the Zoro Alexa skill. You can do a variety of different things
                        using this skill, such as searching Zoro.com for any item! To do this,
                        all you have to do is say 'search for' and then the item name, for example:
                        'search for drills' or 'search for power saws.'
                        
                        <break time = ".5s"/>

                        After searching for an item, I can send the results to your email or Alexa app, or give more information
                        about the individual products in the search result. You can even add specific items
                        to a list that will appear under your lists right in your
                        Alexa app! After you're done searching, you can have this cart sent to your
                        email with a link that will bring you directly to the Zoro.com checkout where you
                        can go ahead and quickly and efficiently purchase your items.`;

  alexaTest.test([
    {
      request: alexaTest.getIntentRequest('AMAZON.HelpIntent'),
      says: speechText,
      repromptsNothing: false,
      shouldEndSession: false,
    },
  ]);
});
