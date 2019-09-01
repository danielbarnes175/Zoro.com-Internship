const axios = require('axios');
const ErrorService = require('./ErrorService.js');

function calculateAvlInfo(numAvailable) {
  return {
    numAvailable,
    stockStatus: calculateStockStatus(numAvailable),
  };
}

function calculateStockStatus(numAvailable) {
  if (numAvailable > 5) {
    return 'In Stock';
  }
  if (numAvailable > 0) {
    return 'Limited Stock';
  }
  return 'Backordered';
}

function createPostData(itemId) {
  const postData = {[itemId]: ''};
  return postData;
}

function parseResults(items) {
  let numAvailable = 'N/A';
  const result = {}; 
  Object.keys(items).forEach((item) => {
    numAvailable = parseInt(items[item][2], 10);
    result[item] = calculateAvlInfo(numAvailable);
  });
  return result;
}
async function fetchAvlData(postData) {
  const returnedData = await axios.post('/* removed */',
    postData);
  return returnedData.data;
}

module.exports = {
  getAvailability: async(itemId) => {
    const postData = createPostData(itemId);

    try {
      const returnedData = await fetchAvlData(postData);
      const avlInfo = parseResults(returnedData);
      return avlInfo[itemId].stockStatus.toLowerCase();
    } catch (error) {
      throw new ErrorService('API_FAILURE');
    }
  },
};
