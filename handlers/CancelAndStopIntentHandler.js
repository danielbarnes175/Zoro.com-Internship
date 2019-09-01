module.exports = {
  canHandle: function canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
                handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle: function handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Thank you for using the Zoro search interface. Goodbye!')
      .getResponse();
  },
};
