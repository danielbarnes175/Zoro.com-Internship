module.exports = {
  canHandle: function canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle: function handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Thank you for using the Zoro search interface. Goodbye!')
      .getResponse();
  },
};

