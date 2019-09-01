const sessionAttributeService = require('../services/SessionAttributeService.js');
const ErrorService = require('../services/ErrorService.js');

function getPrice(content, productIdx) {
  let paragraph = `Item ${productIdx + 1} costs $`;
  paragraph += `${content[productIdx].itemPrice}.`;
  return paragraph;
};

module.exports = {
  canHandle: ({requestEnvelope: {request}}) => request.type === 'IntentRequest' && request.intent.name === 'PriceInfoIntent',

  handle: ({attributesManager, responseBuilder, requestEnvelope: {request}}) => {
    const sessionAttributes = attributesManager.getSessionAttributes();
    const {products, searchTerm} = sessionAttributes;
    let speechText = '';

    if (products) {
      let productIdx;

      if (request.intent.slots.number.value) {
        productIdx = request.intent.slots.number.value - 1;
      } else {
        productIdx = request.intent.slots.ordinal.value - 1;
      }

      try {
        if (sessionAttributeService.validateItemIdx(productIdx, products, searchTerm)) {
          speechText = getPrice(products, productIdx);
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
