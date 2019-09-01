const emailService = require('../services/EmailService.js');
const ErrorService = require('../services/ErrorService.js');

module.exports = {
  canHandle: ({requestEnvelope: {request}}) => request.type === 'IntentRequest' && request.intent.name === 'SendEmailIntent',

  handle: async({attributesManager, responseBuilder, requestEnvelope}) => {
    const sessionAttributes = attributesManager.getSessionAttributes();
    const {products} = sessionAttributes;
    const {searchTerm} = sessionAttributes;
    let speechText;

    if (products) {
      const {apiAccessToken} = requestEnvelope.context.System;
      const {apiEndpoint} = requestEnvelope.context.System;

      try {
        const emailAddress = await emailService.getUserEmail(apiEndpoint, apiAccessToken);
        const emailContent = emailService.parseEmailSearchResults(products, searchTerm);
        const subjectLine = `Zoro Search Results of "${searchTerm}"`;
        emailService.sendResults(emailContent, emailAddress, subjectLine);

        speechText = `I sent the search results of "${searchTerm}" to your email.`;
      } catch (error) {
        return ErrorService.buildResponse(responseBuilder, error);
      }
    } else {
      speechText = `Please search for an item first!`;
    }

    return responseBuilder
      .speak(speechText)
      .reprompt('You can start a new search by saying: <break time = ".2s"/> "Search for item name."')
      .getResponse();
  },
};
