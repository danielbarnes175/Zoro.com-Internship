module.exports = {
  canHandle: ({requestEnvelope: {request}}) => request.type === 'IntentRequest' && request.intent.name === 'SendTextIntent',
  handle: ({responseBuilder}) => responseBuilder
    .speak('I have sent you a text message. Thank you for searching Zoro.com!')
    .reprompt()
    .getResponse(),
};
