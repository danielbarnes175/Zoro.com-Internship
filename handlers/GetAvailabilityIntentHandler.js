const sessionAttributeService = require('../services/SessionAttributeService.js');
const ErrorService = require('../services/ErrorService.js');

module.exports = {
  canHandle: ({requestEnvelope: {request}}) => request.type === 'IntentRequest' && request.intent.name === 'GetAvailabilityIntent',
  handle: async({attributesManager, responseBuilder, requestEnvelope: {request}}) => {
    let sessionAttributes = attributesManager.getSessionAttributes();
    const {products, searchTerm} = sessionAttributes;
    let speechText = '';

    if (products) {
      let itemIdx;

      if (request.intent.slots.number.value) {
        itemIdx = request.intent.slots.number.value - 1;
      } else {
        itemIdx = request.intent.slots.ordinal.value - 1;
      }

      try {
        if (sessionAttributeService.validateItemIdx(itemIdx, products, searchTerm)) {
          // update products after caching availability
          sessionAttributes
            = await sessionAttributeService.cacheAvailability(attributesManager, sessionAttributes, itemIdx);
          speechText = `Item ${itemIdx + 1} is currently ${sessionAttributes.products[itemIdx].itemAvailability}`;
        } else {
          speechText = 'Sorry, that is not a valid result number. Please choose the result number from the list or say <break time = ".2s"/> "more information" <break time = ".2s"/> to hear the list again.';
        }
      } catch (error) {
        return ErrorService.buildResponse(responseBuilder, error);
      }
    } else {
      speechText = 'Please search for an item first!';
    }
    return responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};
