const index = require('../index.js');
const alexaTest = require('alexa-skill-test-framework');

// initialize the testing framework
alexaTest.initialize(
  index,
  '/* removed */',
  'amzn1.ask.account.VOID');

function parseResults(products) {
  let paragraph = '';
  for (let i = 0; i < products.length; i++) {
    const itemTitle = /* removed */;
    if (i === 0) {
      paragraph = `Result number ${i + 1}: ${itemTitle} <break time = "1s"/>`;
    } else if (i < products.length - 1) {
      paragraph += `Number ${i + 1}: ${itemTitle} <break time = "1s"/>`;
    } else {
      paragraph += `Number ${i + 1}: ${itemTitle}.`;
    }
  }
  return `${paragraph} You can learn more about a specific item. For example, try saying: <break time = ".2s"/> "more on number one" <break time = ".2s"/>`;
};

const searchTerm = ['hammers', 'yeet'];
const body = /* removed */;
const allData = parseResults(body.result.products);
const products = [
  /* removed */
];

describe('MoreInformation', () => {
  describe('Hammer Paragraph', () => {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('MoreInformationIntent'),
        says: allData,
        withSessionAttributes: {
          searchTerm: searchTerm[0],
          products: products[0],
        },
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  describe('No item searched', () => {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('MoreInformationIntent'),
        says: 'Please search for an item first!',
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  describe('The item searched has no results', () => {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('MoreInformationIntent'),
        says: `I cannot find any search results of "${searchTerm[1]}". I'm sorry. Please search for another item by saying: "Search for drills".`,
        withSessionAttributes: {
          searchTerm: searchTerm[1],
          products: products[1],
        },
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
});
