const cartService = require('../services/CartService.js');
const listService = require('../services/ListService.js');
const ErrorService = require('../services/ErrorService.js');

module.exports = {
  canHandle: ({requestEnvelope: {request}}) => request.type === 'IntentRequest'
    && request.intent.name === 'AddCartItemIntent',
  handle: async({attributesManager, responseBuilder, requestEnvelope: {request}, serviceClientFactory}) => {
    /* Confirm the request: if confirmation denied */
    if (request.dialogState === 'COMPLETED' && request.intent.confirmationStatus === 'DENIED') {
      return responseBuilder
        .speak(`The action was canceled. You can retry adding an item to the cart by saying: "add <break time = "0.2s"/> quantity <break time = "0.2s"/> of <break time = "0.2s"/> result number <break time = "0.2s"/> to the cart".`)
        .reprompt(`You can retry adding an item to the cart by saying: "add <break time = "0.2s"/> quantity <break time = "0.2s"/> of <break time = "0.2s"/> result number <break time = "0.2s"/> to the cart".`)
        .getResponse();
    }

    // Get the search results
    const sessionAttributes = attributesManager.getSessionAttributes();
    const {products} = sessionAttributes;

    if (!products) {
      // No item has been searched yet
      return responseBuilder
        .speak(`Please search for an item first so that the search results can be added to your cart.`)
        .reprompt('You can start a new search by saying: <break time = ".2s"/> "Search for item name".')
        .getResponse();
    }

    let speechText;
    try {
      /* Fetch slots and preprocess the slots */
      const {slots} = request.intent;
      const [itemIdx, itemQty] =
        await cartService.preprocessCartSlotValues(slots, attributesManager, sessionAttributes);

      /* Get Confirmation on the slots value */
      if (request.intent.confirmationStatus === 'NONE') {
        return responseBuilder
          .speak(`Are you sure that you would like to add ${itemQty} of result number ${itemIdx + 1} to your cart?`)
          .reprompt(`Are you sure that you would like to add ${itemQty} of result number ${itemIdx + 1} to your cart?`)
          .addConfirmIntentDirective()
          .getResponse();
      }

      /* Get list ID */
      const listClient = serviceClientFactory.getListManagementServiceClient();
      const listId = await listService.getListID(listClient);

      /* Check duplicates in the list */
      const isDeleted = await listService.deleteDuplicateListItem(listClient, listId, products[itemIdx].itemID);
      if (isDeleted) {
        speechText = `${products[itemIdx].itemTitle} is already in the list, so I updated its quantity to ${itemQty}.`;
      } else {
        speechText = `Successfully added ${itemQty} <break time = "0.5s"/> "${products[itemIdx].itemTitle}" to your shopping cart.`;
      }

      /* Create and add list item */
      const itemStringVal
        = cartService.itemFieldsToString(products[itemIdx].itemID, 
          itemQty, 
          products[itemIdx].itemTitle, 
          products[itemIdx].itemPrice);
      await listService.addListItem(listClient, listId, itemStringVal);
    } catch (error) {
      return ErrorService.buildResponse(responseBuilder, error);
    }

    return responseBuilder
      .speak(`${speechText} You can receive an email with the link to the cart by saying <break time = "0.2s"/> "send me the cart link" <break time = "0.2s"/> or I can read what's in your cart by saying <break time = "0.2s"/> "what's in my cart".`)
      .reprompt('You can start a new search by saying: "Search for item name".')
      .getResponse();
  },
};
