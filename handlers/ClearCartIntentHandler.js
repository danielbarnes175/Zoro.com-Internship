const listService = require('../services/ListService.js');
const ErrorService = require('../services/ErrorService.js');

module.exports = {
  canHandle: ({requestEnvelope: {request}}) => request.type === 'IntentRequest'
    && request.intent.name === 'ClearCartIntent',
  handle: async({responseBuilder, serviceClientFactory}) => {
    try {
      /* Get user's shopping list ID */
      const listClient = serviceClientFactory.getListManagementServiceClient();
      const listId = await listService.getListID(listClient);

      /* Clear the shopping list */
      await listService.deleteAllActiveItems(listClient, listId);
    } catch (error) {
      return ErrorService.buildResponse(responseBuilder, error);
    }

    return responseBuilder
      .speak(`Successfully cleared your Zoro shopping cart.`)
      .reprompt('You can start another search by saying: <break time=".2s" /> "search for drills."')
      .getResponse();
  },
};
