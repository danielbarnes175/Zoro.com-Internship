const ErrorService = require('../services/ErrorService.js');
const sessionAttributeService = require('../services/SessionAttributeService.js');

function getInfo(products, productIdx) {
  let description = products[productIdx].itemDescription;
  if (description !== '') {
    description += '. ';
  }
  const paragraph = `Number ${productIdx + 1}: <break time = ".5s"/>${products[productIdx].itemTitle}. `
    + `It costs: $${products[productIdx].itemPrice}. `
    + `${description}The minimum order quantity is ${products[productIdx].itemMinQty} and it's ${products[productIdx].itemAvailability}.`;
  return paragraph;
};

module.exports = {
  canHandle: ({requestEnvelope: {request}}) => request.type === 'IntentRequest' && request.intent.name === 'ItemInfoIntent',

  handle: async({attributesManager, responseBuilder, requestEnvelope: {request}}) => {
    let sessionAttributes = attributesManager.getSessionAttributes();
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
          // get the cache of availability, minOrderQty, and description
          sessionAttributes =
            await sessionAttributeService.cacheAvailability(attributesManager, sessionAttributes, productIdx);
          sessionAttributes =
            await sessionAttributeService.cacheProductInfo(attributesManager, sessionAttributes, productIdx);
          speechText = getInfo(sessionAttributes.products, productIdx);
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
