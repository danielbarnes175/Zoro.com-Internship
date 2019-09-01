function createCardContent(content, searchParameters) {
  const mainURL = `/* removed */${searchParameters.split(' ').join('%20')}`;
  let paragraph = `Search Page of "${searchParameters}": \n${mainURL}\n\n`;

  for (let i = 0; i < content.length; i++) {
    // make new url
    const itemName = content[i].itemTitle;
    const newURL = `/* removed */${content[i].itemID}`;

    paragraph = paragraph.concat(`Item Name: ${itemName}\n`);
    paragraph = paragraph.concat(`${newURL}\n\n`);
  }
  return paragraph;
};

module.exports = {
  canHandle: ({requestEnvelope: {request}}) => request.type === 'IntentRequest' && request.intent.name === 'SendAppIntent',

  handle: ({attributesManager, responseBuilder}) => {
    const sessionAttributes = attributesManager.getSessionAttributes();
    const {products} = sessionAttributes;
    const {searchTerm} = sessionAttributes;

    // Check if an item has been searched
    if (products) {
      const cardContent = createCardContent(products, searchTerm);

      return responseBuilder
        .speak(`You can check the search results of "${searchTerm}" on your Alexa app now. Thank you for searching Zoro.com!`)
        .withStandardCard(`Zoro Search Results of "${searchTerm}"`, cardContent)
        .reprompt('You can start a new search by saying: <break time = ".2s"/> "search for drills."')
        .getResponse();
    }

    // No item has been searched yet
    return responseBuilder
      .speak(`Please search for an item first!`)
      .reprompt('You can start a search by saying: <break time = ".2s"/> "search for drills."')
      .getResponse();
  },
};
