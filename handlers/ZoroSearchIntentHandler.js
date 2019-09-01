const urlSearchService = require('../services/UrlSearchService.js');
const ErrorService = require('../services/ErrorService.js');

module.exports = {
  canHandle: ({requestEnvelope: {request}}) => request.type === 'IntentRequest' && request.intent.name === 'SearchItemIntent',
  handle: async({attributesManager, responseBuilder, requestEnvelope: {request}}) => {
    const searchTerm = urlSearchService.stripFiller(request.intent.slots.item.value);

    if (searchTerm === '') {
      return responseBuilder
        .speak('Please search with the item\'s name or Zoro number.')
        .reprompt('You can search by saying: <break time=".2s" /> "search for drills"')
        .getResponse();
    }

    let searchResults;
    try {
      searchResults = await urlSearchService.getSearchResults(searchTerm);
    } catch (error) {
      return ErrorService.buildResponse(responseBuilder, error);
    }

    let speechText = `I searched for "${searchTerm}" and found`;

    if (searchResults.length === 0) {
      speechText += ' no results. I\'m sorry. You can search for another item by saying: <break time = ".2s"/> "Search for drills" <break time = ".2s"/>.';
    } else if (searchResults.length === 1) {
      speechText += ' the top result. I can either send you the result, or you can request more information.';
    } else {
      speechText += ` the top ${searchResults.length} results. I can either send you the results, or you can request more information.`;
    }

    const sessionAttributes = attributesManager.getSessionAttributes();
    sessionAttributes.products = searchResults;
    sessionAttributes.searchTerm = searchTerm;
    attributesManager.setSessionAttributes(sessionAttributes);

    return responseBuilder
      .speak(speechText)
      .reprompt('You can also start another search!')
      .getResponse();
  },
};

