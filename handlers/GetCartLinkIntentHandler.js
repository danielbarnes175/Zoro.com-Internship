const cartService = require('../services/CartService.js');
const listService = require('../services/ListService.js');
const emailService = require('../services/EmailService.js');
const ErrorService = require('../services/ErrorService.js');

async function createEmailWithSlots({id, qty, title}) {
  const itemStringVal =
    cartService.itemFieldsToString(id, qty, title, 1/* placeholder */);
  const emailContent = emailService.parseEmailCartLink([itemStringVal]);

  return emailContent;
};

async function createEmailWithList({listClient, listId}) {
  const cartListItems = await listService.getListItems(listClient, listId);
  const cartItemStringVals = listService.getListItemValues(cartListItems);
  const emailContent = emailService.parseEmailCartLink(cartItemStringVals);

  return emailContent;
};


module.exports = {
  canHandle: ({requestEnvelope: {request}}) => request.type === 'IntentRequest'
    && request.intent.name === 'GetCartLinkIntent',
  handle: async({attributesManager, responseBuilder, requestEnvelope: {request, context}, serviceClientFactory}) => {
    // Get the search results
    const sessionAttributes = attributesManager.getSessionAttributes();
    const {products} = sessionAttributes;
    const {apiAccessToken, apiEndpoint} = context.System;
    const {slots} = request.intent;

    let speechText;
    let createEmailStrategy; // stores the function to create email content
    let id; let qty; let title;
    let listClient; let listId;

    if (cartService.slotsSpecified(slots)) {
      /* Confirm the request: if confirmation denied */
      if (request.dialogState === 'COMPLETED' && request.intent.confirmationStatus === 'DENIED') {
        return responseBuilder
          .speak(`The action was canceled.`)
          .reprompt(`You can retry getting a cart link with a specific item by saying: "send cart link with <break time = "0.2s"/> quantity <break time = "0.2s"/> of <break time = "0.2s"/> result number <break time = "0.2s"/> to the cart".`)
          .getResponse();
      }

      if (!products) {
        // No item has been searched yet
        return responseBuilder
          .speak(`Please search for an item first so that the cart link can be sent to your email.`)
          .reprompt('You can start a new search by saying: <break time=".2s" /> Search for drills"')
          .getResponse();
      }

      /* If is specified, send a cart link with the slot values */
      let itemIdx;
      let itemQty;
      try {
        [itemIdx, itemQty] = await cartService.preprocessCartSlotValues(slots, attributesManager, sessionAttributes);
      } catch (error) {
        return ErrorService.buildResponse(responseBuilder, error);
      }

      /* Get Confirmation on the slots value */
      if (request.intent.confirmationStatus === 'NONE') {
        return responseBuilder
          .speak(`Are you sure that you would like to send a link to a cart with ${itemQty} of result number ${itemIdx + 1}?`)
          .reprompt(`Are you sure that you would like to send a link to a cart with ${itemQty} of result number ${itemIdx + 1}?`)
          .addConfirmIntentDirective()
          .getResponse();
      }

      /* Setup the email strategy as the one using slots and setup its param */
      [id, qty, title] = [products[itemIdx].itemID, itemQty, products[itemIdx].itemTitle];
      createEmailStrategy = createEmailWithSlots;

      speechText = `I sent the link to the shopping cart with ${itemQty} ${products[itemIdx].itemTitle} to your email.`;
    } else {
      /* Get user's shopping list ID */
      listClient = serviceClientFactory.getListManagementServiceClient();
      try {
        listId = await listService.getListID(listClient);
      } catch (error) {
        return ErrorService.buildResponse(responseBuilder, error);
      }

      /* Setup the email strategy as the one using lists and setup its param */
      createEmailStrategy = createEmailWithList;

      speechText = `I have sent the Zoro shopping cart link to your email.`;
    }

    /* Create and send email */
    try {
      const emailSubject = `Zoro Cart Link`;
      const emailAddress = await emailService.getUserEmail(apiEndpoint, apiAccessToken);
      const emailContent = await createEmailStrategy({
        id, qty, title, listClient, listId,
      });

      emailService.sendResults(emailContent, emailAddress, emailSubject);
    } catch (error) {
      return ErrorService.buildResponse(responseBuilder, error);
    }

    /* Return */
    return responseBuilder
      .speak(speechText)
      .reprompt('You can start a new search by saying: "Search for item name"')
      .getResponse();
  },
};
