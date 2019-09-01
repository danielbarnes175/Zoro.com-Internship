const availabilityService = require('./AvailabilityService.js');
const urlSearchService = require('./UrlSearchService.js');
const ErrorService = require('./ErrorService.js');


module.exports = {
  // access the endpoint and store minOrderQty and Description into session attr
  cacheProductInfo: async(attributesManager, sessionAttributes, itemIdx) => {
    // check if the product info have been cached in session attributes already
    const {products} = sessionAttributes;
    if ('itemMinQty' in products[itemIdx] && 'itemDescription' in products[itemIdx]) {
      return sessionAttributes;
    }

    // access the endpoint
    const endpointResponse = await urlSearchService.getProductsEndpointResults(products[itemIdx].itemID);

    // get description and replace & with "with" as Alexa cannot read out &
    let description = endpointResponse.attributes.find(attr => attr.name === 'Features');
    if (description) {
      description = `${description.value.replace(/\s{0,1}&\s{0,1}/g, ' and ')}`;
    } else {
      description = '';
    }

    // set the attributes
    products[itemIdx].itemDescription = description;
    products[itemIdx].itemMinQty =
      endpointResponse.validation.minOrderQuantity || endpointResponse.zoroMinOrderQty;

    const newSessionAttributes = sessionAttributes;
    newSessionAttributes.products = products;
    attributesManager.setSessionAttributes(newSessionAttributes);

    return newSessionAttributes;
  },

  cacheAvailability: async(attributesManager, sessionAttributes, itemIdx) => {
    const {products} = sessionAttributes;
    if ('itemAvailability' in products[itemIdx]) {
      return sessionAttributes;
    }

    try {
      const availability = await availabilityService.getAvailability(products[itemIdx].itemID);
      products[itemIdx].itemAvailability = availability.toLowerCase();

      const newSessionAttributes = sessionAttributes;
      newSessionAttributes.products = products;
      attributesManager.setSessionAttributes(newSessionAttributes);
      return newSessionAttributes;
    } catch (error) {
      throw new ErrorService('API_FAILURE');
    }
  },

  // returns true if itemIdx is valid, and will throw error if products sessionAttr is empty
  validateItemIdx: (itemIdx, products, searchTerm) => {
    if (products.length === 0) {
      throw new ErrorService('CUSTOM',
        `I cannot find any search results of "${searchTerm}". I'm sorry. Please search for another item by saying: "Search for drills".`,
        `You can search for another item by saying: "Search for drills".`,
        []);
    }
    return !(isNaN(itemIdx) || itemIdx >= products.length || itemIdx < 0);
  },
};
