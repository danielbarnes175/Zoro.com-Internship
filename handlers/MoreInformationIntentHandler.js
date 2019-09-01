function parseResults(products) {
  let paragraph = '';
  for (let i = 0; i < products.length; i++) {
    const {itemTitle} = products[i];
    if (i === 0) {
      paragraph = `Result number ${i + 1}: ${itemTitle} <break time = "1s"/>`;
    } else if (i < products.length - 1) {
      paragraph += `Number ${i + 1}: ${itemTitle} <break time = "1s"/>`;
    } else {
      paragraph += `Number ${i + 1}: ${itemTitle}.`;
    }
  }
  return `${paragraph} You can learn more about a specific item. For example, try saying: <break time = ".2s"/> "more on number one" <break time = ".2s"/>`;
};

module.exports = {
  canHandle: ({requestEnvelope: {request}}) => request.type === 'IntentRequest' && request.intent.name === 'MoreInformationIntent',

  handle: ({attributesManager, responseBuilder}) => {
    const sessionAttributes = attributesManager.getSessionAttributes();
    const {products, searchTerm} = sessionAttributes;
    let speechText; let repromptText;


    if (products) {
      if (products.length === 0) {
        speechText = `I cannot find any search results of "${searchTerm}". I'm sorry. Please search for another item by saying: "Search for drills".`;
        repromptText = 'You can search for an item by saying: "search for drills".';
      } else {
        speechText = parseResults(products);
        repromptText = 'You can also learn about an item\'s price or availability. For example, try saying: <break time = ".2s"/> "price of number one" <break time = ".2s"/>';
      }
    } else {
      speechText = 'Please search for an item first!';
      repromptText = 'You can search for an item by saying: "search for drills".';
    }
    return responseBuilder
      .speak(speechText)
      .reprompt(repromptText)
      .getResponse();
  },
};
