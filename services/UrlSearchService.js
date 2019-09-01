const axios = require('axios');
const ErrorService = require('../services/ErrorService.js');

const filler = [
  'about', 'after', 'all', 'also', 'am', 'an', 'and', 'another', 'any', 'are', 'as', 'at', 'be',
  'because', 'been', 'before', 'being', 'between', 'both', 'but', 'by', 'came',
  'come', 'could', 'did', 'do', 'each', 'for', 'from', 'get', 'got', 'has', 'had',
  'he', 'have', 'her', 'here', 'him', 'himself', 'his', 'how', 'if', 'in', 'into',
  'is', 'it', 'like', 'make', 'many', 'me', 'might', 'more', 'most', 'much', 'must',
  'my', 'never', 'now', 'of', 'on', 'only', 'or', 'other', 'our', 'out', 'over',
  'said', 'same', 'see', 'should', 'since', 'some', 'still', 'such', 'take', 'than',
  'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they', 'this', 'those',
  'through', 'to', 'too', 'under', 'up', 'very', 'was', 'way', 'we', 'well', 'were',
  'what', 'where', 'which', 'while', 'who', 'with', 'would', 'you', 'your', 'a', 'i', 'search', 'item', 'number', 
];

module.exports = {

  stripFiller: (searchTerm) => {
    const returnedTerm = searchTerm
      .split(' ')
      .filter(value => filler.indexOf(value.toLowerCase()) === -1)
      .join(' ');
    return returnedTerm;
  },

  getSearchResults: async(searchTerm) => {
    let returnedData;
    try {
      returnedData = await module.exports.getSaytEndpointResults(searchTerm);
    } catch (error) {
      throw new ErrorService('API_FAILURE');
    }

    return module.exports.formatSaytEndpointResults(returnedData);
  },

  getProductsEndpointResults: async(itemId) => {
    const body = await axios.get(`/* removed */`);
    return body.data.products[0];
  },

  getSaytEndpointResults: async(searchTerm) => {
    // Construct URL
    let url = '/* removed */';
    url += searchTerm.split(' ').join('+');
    url += '/* removed */';

    const body = await axios.get(url);
    return /* removed */;
  },

  // creates a json object based on the response object of the sayt endpoint 
  formatSaytEndpointResults: (saytResponse) => {
    if (!saytResponse) {
      return [];
    }
    return saytResponse.map(({allMeta}) => ({
      itemID: /* removed */,
      itemBrand: /* removed */,
      itemTitle: /* removed */,
      itemImage: /* removed */,
      itemPrice: /* removed */,
    }));
  },

};
