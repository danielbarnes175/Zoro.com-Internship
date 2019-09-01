const errors = {
  VIEW_EMAIL: {
    speak: 'I don\'t have permission to access your email address. I\'ve sent a card to your Alexa app where you can update these permissions. Once you have done this, please ask for email again.',
    reprompt: 'I don\'t have permission to access your email address. Please enable them in the Zoro skill settings',
    permissions: [
      'alexa::profile:email:read',
    ],
  },
  ACCESS_LIST: {
    speak: 'I don\'t have permission to access your shopping lists. I\'ve sent a card to your Amazon Alexa app where you can update those permissions. Once you have done this, please ask for shopping list again.',
    reprompt: 'I don\'t have permission to access your shopping lists. Please enable them in the Zoro skill settings',
    permissions: [
      'read::alexa:household:list',
      'write::alexa:household:list',
    ],
  },
  EMPTY_LIST: {
    speak: 'You have no items in your Zoro shopping cart. You can add an item to the cart by saying "add <break time = "0.2s"/> quantity <break time = "0.2s"/> of <break time = "0.2s"/> result number <break time = "0.2s"/> to the cart".',
    reprompt: 'You can add an item to the cart by saying "add <break time = "0.2s"/> quantity <break time = "0.2s"/> of <break time = "0.2s"/> result number <break time = "0.2s"/> to the cart".',
    permissions: [],
  },
  NO_ITEM_SELECTED: {
    speak: 'Which item do you want to add to your cart? Please tell me the result number from the list, such as <break time = "0.2s"/> "one".',
    reprompt: 'Which item do you want to add to your cart? Please tell me the result number from the list, such as <break time = "0.2s"/> "one".',
    permissions: [],
    elicitSlot: 'itemNum',
  },
  INVALID_ITEM_SELECTED: {
    speak: 'Please only select an item from the search results to add to the cart. Please tell me the result number from the list, such as <break time = "0.2s"/> "one".',
    reprompt: 'You can also obtain the list of search results by saying <break time = "0.2s"/> "more info."',
    permissions: [],
    elicitSlot: 'itemNum',
  },
  NO_QUANTITY_SPECIFIED: {
    speak: 'How many of the selected item do you want to add to your cart? Please tell me the quantity number, such as <break time = "0.2s"/> "ten".',
    reprompt: 'How many of the selected item do you want to add to your cart? Please tell me the quantity number, such as <break time = "0.2s"/> "ten".',
    permissions: [],
    elicitSlot: 'itemQty',
  },
  QUANTITY_TOO_LARGE: {
    speak: 'Sorry, the quantity must be less than ten thousand. How many of the selected item would you like?',
    reprompt: 'Sorry, the quantity must be less than ten thousand. How many of the selected item would you like?',
    permissions: [],
    elicitSlot: 'itemQty',
  },
  NO_VALID_ITEM_IN_LIST: {
    speak: `You have no recognizable Zoro products in your Zoro shopping cart. You can add an item to the cart by saying "add <break time = "0.2s"/> quantity <break time = "0.2s"/> of <break time = "0.2s"/> result number <break time = "0.2s"/> to the cart".`,
    reprompt: 'You can add an item to the cart by saying "add <break time = "0.2s"/> quantity <break time = "0.2s"/> of <break time = "0.2s"/> result number <break time = "0.2s"/> to the cart".',
    permissions: [],
  },
  API_FAILURE: {
    speak: 'Uh oh. It looks like there\'s a problem getting that data for you. Please try again later.',
    reprompt: 'Thank you for using Zoro dot com', // Probably don't want to reprompt in a case where this is the error.
    permissions: [],
  },
  DEFAULT: {
    speak: 'Something went wrong. Please try again.',
    reprompt: 'Something went wrong. Please try again.',
    permissions: [],
  },

};

module.exports = class ErrorService extends Error {
  constructor(errorKey, speak, reprompt, permissions, elicitSlot) {
    const key = errorKey || 'DEFAULT';
    super(key); // errorKey is passed into the message param
    this.name = `${key}_ERROR`;

    // custom class members
    this.key = key;
    if (this.key === 'CUSTOM') {
      this.speak = speak || errors.DEFAULT.speak;
      this.reprompt = reprompt || errors.DEFAULT.reprompt;
      this.permissions = permissions || errors.DEFAULT.permissions;
      this.elicitSlot = elicitSlot; // can be undefined
    } else {
      this.speak = errors[this.key].speak;
      this.reprompt = errors[this.key].reprompt;
      this.permissions = errors[this.key].permissions;
      this.elicitSlot = errors[this.key].elicitSlot;
    }
  }

  /**
   * This method is called when an intent handler catches an error and needs to
   * return a response based on the caught error.
   * 
   * @param {*} responseBuilder The responseBuilder of the handleInput passed 
   *    to the intent handler where the error is caught. It is used to created
   *    intent's response based on the error
   * @param {*} error The error caught in the calling intent handler
   */
  static buildResponse(responseBuilder, error) {
    if (error instanceof ErrorService) {
      let response = responseBuilder
        .speak(error.speak)
        .reprompt(error.reprompt);

      if (error.permissions.length > 0) {
        response = response
          .withAskForPermissionsConsentCard(error.permissions);
      }
      
      if (error.elicitSlot) {
        response = response
          .addElicitSlotDirective(error.elicitSlot);
      }

      return response.getResponse();
    }
    
    return responseBuilder
      .speak(errors.DEFAULT.speak)
      .reprompt(errors.DEFAULT.reprompt)
      .getResponse();
  }
};
