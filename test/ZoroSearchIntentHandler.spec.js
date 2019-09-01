const index = require('../index.js');
const alexaTest = require('alexa-skill-test-framework');
const MockAdapter = require('axios-mock-adapter');
const axios = require('axios');

// initialize the testing framework
alexaTest.initialize(
  index,
  '/* removed */',
  'amzn1.ask.account.VOID');

// Creating an key value object for the slot
const obj = [
  {item: 'cheerios'},
  {item: 'yeet'},
  {item: 'saddle cla'},
  {item: 'about after all cheerios'},
  {item: 'about after all'},
  {item: 'about after all saddle cla'},
  {item: 'about after all yeet'},
  {item: 'david spivey'},
];

const urls = [
  // url for cheerios
  '/* removed */',
  // url for yeet
  '/* removed */',
  // url for saddle cla
  '/* removed */',
  // Following urls are to catch request to the second API

  // urls for cheerios
  '/* removed */',
  '/* removed */',
  // url for saddle cla
  '/* removed */',
];

const dataToReturnFromUrlOne = [
  /* removed */
];

const dataToReturnFromUrlTwo = [
  /* removed */
];


let mock;
describe('ZoroSearchIntent', () => {
  beforeEach(() => {
    mock = new MockAdapter(axios);
    mock
      .onGet(urls[0]).reply(200, dataToReturnFromUrlOne[0])
      .onGet(urls[1]).reply(200, dataToReturnFromUrlOne[1])
      .onGet(urls[2])
      .reply(200, dataToReturnFromUrlOne[2])
      .onGet(urls[3])
      .reply(200, dataToReturnFromUrlTwo[0])
      .onGet(urls[4])
      .reply(200, dataToReturnFromUrlTwo[0])
      .onGet(urls[5])
      .reply(200, dataToReturnFromUrlTwo[1]);
  });
  afterEach(() => {
    mock.restore();
  });

  // Case where multiple items are returned
  describe('Searching for cheerios', () => {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('SearchItemIntent', obj[0]),
        says: `I searched for "${obj[0].item}" and found the top 2 results. I can either send you the results, or you can request more information.`,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  // Case where no items are returned
  describe('Searching for yeet', () => {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('SearchItemIntent', obj[1]),
        says: `I searched for "${obj[1].item}" and found no results. I'm sorry. You can search for another item by saying: <break time = ".2s"/> "Search for drills" <break time = ".2s"/>.`,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  // Case where one item is returned
  describe('Searching for saddle cla', () => {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('SearchItemIntent', obj[2]),
        says: `I searched for "${obj[2].item}" and found the top result. I can either send you the result, or you can request more information.`,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  // Case where filler words are present and multiple results are returned
  describe('Searching for cheerios with filler words', () => {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('SearchItemIntent', obj[3]),
        says: `I searched for "cheerios" and found the top 2 results. I can either send you the results, or you can request more information.`,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  // Case where only filler words are present
  describe('Searching with only filler words', () => {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('SearchItemIntent', obj[4]),
        says: 'Please search with the item\'s name or Zoro number.',
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  // Case where filler words are present and one result is returned
  describe('Searching for saddle cla with filler words', () => {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('SearchItemIntent', obj[5]),
        says: `I searched for "saddle cla" and found the top result. I can either send you the result, or you can request more information.`,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  // Case where filler words are present and no results are returned
  describe('Searching for yeet with filler words', () => {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('SearchItemIntent', obj[6]),
        says: 'I searched for "yeet" and found no results. I\'m sorry. You can search for another item by saying: <break time = ".2s"/> "Search for drills" <break time = ".2s"/>.',
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });

  describe('With API failures', () => {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest('SearchItemIntent', obj[7]),
        says: `Uh oh. It looks like there's a problem getting that data for you. Please try again later.`,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
});
