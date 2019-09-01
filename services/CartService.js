/**
 * Helper file for the operation specific to the cart functionality
 */
const ErrorService = require('./ErrorService.js');
const sessionAttributeService = require('./SessionAttributeService.js');

module.exports = {
  slotsSpecified: slots => slots.itemOrder.value || slots.itemNum.value || slots.itemQty.value,

  calculateTotalPrice: (listValues) => {
    let price = 0;
    let hasZoroItemInCart = false;
    for (let i = 0; i < listValues.length; i++) {
      try {
        const listItem = module.exports.itemFieldsFromString(listValues[i]);
        price += Number.parseFloat(listItem[3]);
        hasZoroItemInCart = true;
      } catch (error) { } // Do nothing; skip item when list item has invalid formatting.
    }
    
    if (!hasZoroItemInCart) {
      throw new ErrorService('NO_VALID_ITEM_IN_LIST');
    }

    price = parseFloat(Math.round(price * 100) / 100).toFixed(2);
    return price;
  },

  preprocessCartSlotValues: async(slots, attributesManager, sessionAttributes) => {
    // Validate itemNum/itemOrder
    if (!slots.itemNum.value && !slots.itemOrder.value) {
      throw new ErrorService('NO_ITEM_SELECTED');
    }

    const itemIdx = slots.itemNum.value ? slots.itemNum.value - 1 : slots.itemOrder.value - 1;
    const itemQty = slots.itemQty.value ? slots.itemQty.value : -1;

    // Validate itemIdx
    if (!sessionAttributeService.validateItemIdx(itemIdx, sessionAttributes.products, sessionAttributes.searchTerm)) {
      throw new ErrorService('INVALID_ITEM_SELECTED');
    }
    // Update product by getting cache of itemMinQty and Validate itemQty
    const {products} = await sessionAttributeService.cacheProductInfo(attributesManager, sessionAttributes, itemIdx);
    if (itemQty === -1) {
      throw new ErrorService('NO_QUANTITY_SPECIFIED');
    } else if (itemQty < products[itemIdx].itemMinQty
      || itemQty % products[itemIdx].itemMinQty !== 0) {
      throw new ErrorService('CUSTOM',
        `You can only add a multiple of ${products[itemIdx].itemMinQty} numbers of the selected item to the cart. Please tell me another quantity number, such as <break time = "0.2s"/> "ten".`,
        `How many of the selected item do you want to add to your cart?`,
        [],
        'itemQty');
    } else if (itemQty >= 10000) {
      throw new ErrorService('QUANTITY_TOO_LARGE');
    }

    return [itemIdx, itemQty];
  },

  itemFieldsToString: (id, qty, name, price) => {
    /**
     * The format should be: QTY------ NAME (Zoro #: ID)
     *    Max length of QTY = 4 + 1
     *      QTY should be: NUMBER_----...
     *      It should have a trailing space and fill the remaining space with '-'
     *    Max length of NAME =  255 - 16 ('qtyText--- ') - 15 (' (ID: G1234567) ')) - 30 (Price) = 194
     *    Length of ID = 8
     *    Max total length of the whole string = 255
     */
    const LENGTH_EXCEPT_FOR_NAME = 190;

    const qtyText = `${String(qty)} `.padEnd(5, '-');

    let nameText = name;
    if (name.length > LENGTH_EXCEPT_FOR_NAME) {
      nameText = `${name.substring(0, LENGTH_EXCEPT_FOR_NAME - 1)}…`;
    }
    const priceFixed = Math.round(((price * qty) * 100) / 100).toFixed(2);

    return `${qtyText}--- ${nameText} (ID: ${id}) (Price: $${priceFixed})`;
  },

  itemFieldsFromString: (stringVal) => {
    let fields = stringVal.split('--- ');
    if (fields.length === 2) {
      const qty = fields[0].replace(/-| /g, '').trim();
      fields = fields[1].split('(ID:');

      if (fields.length === 2
        && qty.length <= 4 && !isNaN(qty)) {
        const name = fields[0].trim(); // TODO how will Alexa read out "...
        const id = fields[1].trim().substring(0, 8);
        let price = fields[1].trim().substring(19);
        price = price.substring(0, price.length - 1);

        if (id[0] === 'G'
          && id.length === 8
          && !isNaN(id.substring(1))
          && price.length > 0
          && !isNaN(price)
        ) {
          return [id, qty, name, price];
        }
      }
    }

    throw new Error('Invalid string value for cart item');
  },

  getBuildCartLink: (itemStringVals) => {
    /* Create the query param from the list of cart items */
    const queryParam = itemStringVals.reduce((accumulator, value) => {
      try {
        const [id, qty, name] = module.exports.itemFieldsFromString(value);
        return {
          ...accumulator,
          [id]: qty,
        };
      } catch (error) {
        return accumulator;
      }
    }, {}/* initial empty value of the accumulator */);

    if (Object.keys(queryParam).length === 0 && queryParam.constructor === Object) {
      throw new ErrorService('NO_VALID_ITEM_IN_LIST');
    }

    return `/* removed */${encodeURIComponent(JSON.stringify(queryParam))}`;
  },

};
