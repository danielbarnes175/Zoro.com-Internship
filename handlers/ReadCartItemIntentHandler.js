const cartService = require('../services/CartService.js');
const listService = require('../services/ListService.js');
const ErrorService = require('../services/ErrorService.js');

function parseCartContent(cartItemStringVals) {
  const firstLine = `In your Zoro Shopping Cart, you have:\n`;

  const speechText = cartItemStringVals.reduce((accumulator, value) => {
    try {
      const [id, qty, name, price] = cartService.itemFieldsFromString(value);
      return `${accumulator}<break time = "0.5s"/> ${qty} <break time = "0.2s"/> ${name}.\n`;
    } catch (error) {
      return accumulator;
    }
  }, '');

  if (speechText === '') { return `You have no items in your Zoro shopping cart. You can add an item to the cart by saying "add <break time = "0.2s"/> quantity <break time = "0.2s"/> of <break time = "0.2s"/> result number <break time = "0.2s"/> to the cart".`; }

  const lastLine = `<break time = "0.5s"/> You can receive an email with a link to the cart by saying <break time = ".2s"/> "send me the cart link."`;
  return firstLine + speechText + lastLine;
};

module.exports = {
  canHandle: ({requestEnvelope: {request}}) => request.type === 'IntentRequest'
    && request.intent.name === 'ReadCartItemIntent',
  handle: async({responseBuilder, serviceClientFactory}) => {
    let cartItemStringVals;

    try {
      /* Get user's shopping list ID */
      const listClient = serviceClientFactory.getListManagementServiceClient();
      const listId = await listService.getListID(listClient);

      /* Get shopping list */
      const cartListItems = await listService.getListItems(listClient, listId);
      cartItemStringVals = listService.getListItemValues(cartListItems);
    } catch (error) {
      return ErrorService.buildResponse(responseBuilder, error);
    }
    
    const speechText = parseCartContent(cartItemStringVals);

    return responseBuilder
      .speak(speechText)
      .reprompt(`You can receive an email with the link to the cart with the mentioned items by saying <break time = ".2s"/> "send me the cart link."`)
      .getResponse();
  },
};
