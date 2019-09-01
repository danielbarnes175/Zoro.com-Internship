const CartService = require('../services/CartService.js');
const ListService = require('../services/ListService.js');
const ErrorService = require('../services/ErrorService.js');

module.exports = {
  canHandle: ({requestEnvelope: {request}}) => request.type === 'IntentRequest'
      && request.intent.name === 'PriceOfCartIntent',
  handle: async({responseBuilder, serviceClientFactory}) => {
    let speechText;
    try {
      const listClient = serviceClientFactory.getListManagementServiceClient();
      const listId = await ListService.getListID(listClient);

      const list = await ListService.getListItems(listClient, listId);
      const listValues = ListService.getListItemValues(list);

      const price = CartService.calculateTotalPrice(listValues);

      speechText = `The total price of your cart is $${price} excluding shipping and tax.`;
    } catch (error) {
      return ErrorService.buildResponse(responseBuilder, error);
    }
    return responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};
