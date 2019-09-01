module.exports = {
  canHandle: ({requestEnvelope: {request}}) => request.type === 'IntentRequest' && request.intent.name === 'SendResultsIntent',
  handle: ({responseBuilder}) => responseBuilder
    .speak('I can send you the results either by the Alexa App, or an email. Additionally, I can read off the results to you.')
    .reprompt("Hmm I'm not sure how to send the results that way. I can send you the results either by the Alexa App, or an email.")
    .getResponse(),
};
