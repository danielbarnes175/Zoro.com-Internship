module.exports = {
  canHandle: ({requestEnvelope: {request}}) => request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent',
  handle: ({responseBuilder}) => {
    const speechText = `Welcome to the Zoro Alexa skill. You can do a variety of different things
                        using this skill, such as searching Zoro.com for any item! To do this,
                        all you have to do is say 'search for' and then the item name, for example:
                        'search for drills' or 'search for power saws.'
                        
                        <break time = ".5s"/>

                        After searching for an item, I can send the results to your email or Alexa app, or give more information
                        about the individual products in the search result. You can even add specific items
                        to a list that will appear under your lists right in your
                        Alexa app! After you're done searching, you can have this cart sent to your
                        email with a link that will bring you directly to the Zoro.com checkout where you
                        can go ahead and quickly and efficiently purchase your items.`;

    const reprompt = `If you would like to hear the help message again, please say 'help.'`;

    return responseBuilder
      .speak(speechText)
      .reprompt(reprompt)
      .getResponse();
  },
};

