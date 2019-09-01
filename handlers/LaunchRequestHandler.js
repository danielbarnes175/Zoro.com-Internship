module.exports = {
  canHandle: function canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle: function handle(handlerInput) {
    const speechText = 'Welcome to Zoro.com! You can search for an item by keyword or Zoro number. For example: <break time=".2s" /> Search for drills"';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};
