const ErrorService = require('../services/ErrorService.js');
const assert = require('assert');
const {ResponseFactory} = require('ask-sdk-core');

describe('ErrorService', () => {
  describe('Creating a new list permissions error', () => {
    const myError = new ErrorService('ACCESS_LIST');
    it(' should return the correct speechtext for this error', () => {
      assert.equal(myError.speak, 'I don\'t have permission to access your shopping lists. I\'ve sent a card to your Amazon Alexa app where you can update those permissions. Once you have done this, please ask for shopping list again.');
    });
    it(' should return the correct reprompt for this error', () => {
      assert.equal(myError.reprompt, 'I don\'t have permission to access your shopping lists. Please enable them in the Zoro skill settings');
    });
    it(' should return the correct list of permissions', () => {
      assert.deepEqual(myError.permissions, [
        'read::alexa:household:list',
        'write::alexa:household:list',
      ]);
    });
  });

  describe('Creating a new email permissions error', () => {
    const myError = new ErrorService('VIEW_EMAIL');
    it(' should return the correct speechtext for this error', () => {
      assert.equal(myError.speak, 'I don\'t have permission to access your email address. I\'ve sent a card to your Alexa app where you can update these permissions. Once you have done this, please ask for email again.');
    });
    it(' should return the correct reprompt for this error', () => {
      assert.equal(myError.reprompt, 'I don\'t have permission to access your email address. Please enable them in the Zoro skill settings');
    });
    it(' should return the correct list of permissions', () => {
      assert.deepEqual(myError.permissions, ['alexa::profile:email:read']);
    });
  });

  describe('Creating a new api error', () => {
    const myError = new ErrorService('API_FAILURE');
    it(' should return the correct speechtext for this error', () => {
      assert.equal(myError.speak, 'Uh oh. It looks like there\'s a problem getting that data for you. Please try again later.');
    });
    it(' should return the correct reprompt for this error', () => {
      assert.equal(myError.reprompt, 'Thank you for using Zoro dot com');
    });
  });

  describe('Creating a new default error', () => {
    const myError = new ErrorService();
    it(' should return the correct speechtext for this error', () => {
      assert.equal(myError.speak, 'Something went wrong. Please try again.');
    });
    it(' should return the correct reprompt for this error', () => {
      assert.equal(myError.reprompt, 'Something went wrong. Please try again.');
    });
  });

  describe('BuildResponse when passing in an error not an instance of ErrorService', () => {
    const responseBuilder = ResponseFactory.init();
    const myResponse = ErrorService.buildResponse(responseBuilder, new Error());
    const expectedSpeech = '<speak>Something went wrong. Please try again.</speak>';
    it(' should return a ResponseBuilder with the default speechtext', () => {
      assert.equal(myResponse.outputSpeech.ssml, expectedSpeech);
    });
  });

  describe('Defining custom ErrorService error with no speak/reprompt/permission set', () => {
    const customError = new ErrorService('CUSTOM');
    const expectedSpeech = 'Something went wrong. Please try again.';
    it(' should have speech text equal to default', () => {
      assert.equal(customError.speak, expectedSpeech);
    });
  });
});
