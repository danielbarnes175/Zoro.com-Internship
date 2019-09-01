const Alexa = require('ask-sdk-core');
const LaunchRequestHandler = require('./handlers/LaunchRequestHandler.js');
const ZoroSearchHandler = require('./handlers/ZoroSearchIntentHandler.js');
const HelpIntentHandler = require('./handlers/HelpIntentHandler.js');
const CancelAndStopIntentHandler = require('./handlers/CancelAndStopIntentHandler.js');
const SessionEndedRequestHandler = require('./handlers/SessionEndedRequestHandler.js');

const SendAppHandler = require('./handlers/SendAppIntentHandler.js');
const SendEmailIntentHandler = require('./handlers/SendEmailIntentHandler.js');
const MessageHandler = require('./handlers/SendTextIntentHandler.js');
const AddCartItemHandler = require('./handlers/AddCartItemIntentHandler.js');
const ReadCartItemHandler = require('./handlers/ReadCartItemIntentHandler.js');
const ClearCartHandler = require('./handlers/ClearCartIntentHandler.js');
const GetCartLinkHandler = require('./handlers/GetCartLinkIntentHandler.js');
const PriceOfCartHandler = require('./handlers/PriceOfCartIntentHandler.js');

const MoreInfoHandler = require('./handlers/MoreInformationIntentHandler.js');
const SendResultsHandler = require('./handlers/SendResultsIntentHandler.js');
const ItemInformationHandler = require('./handlers/ItemInfoIntentHandler.js');
const PriceHandler = require('./handlers/PriceInfoIntentHandler.js');
const GetAvailabilityHandler = require('./handlers/GetAvailabilityIntentHandler.js');

const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    ZoroSearchHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    
    SendAppHandler,
    SendEmailIntentHandler,
    MessageHandler,

    AddCartItemHandler,
    ReadCartItemHandler,
    ClearCartHandler,
    GetCartLinkHandler,
    PriceOfCartHandler,

    MoreInfoHandler,
    SendResultsHandler,
    ItemInformationHandler,
    PriceHandler,
    
    GetAvailabilityHandler,
  )
  // To allow access to serviceClientFactory, used in shopping list
  .withApiClient(new Alexa.DefaultApiClient()) 
  .lambda();
