/**
 * Helper file for dealing with Alexa's built-in list functionality by using Alexa List API 
 */
const ErrorService = require('./ErrorService.js');

module.exports = {
  getListID: async(listClient, listName = 'Zoro Shopping Cart') => {
    let listOfLists;
    try {
      listOfLists = await listClient.getListsMetadata();
    } catch (error) {
      // No permission so ask for permission
      throw new ErrorService('ACCESS_LIST');
    }

    const targetList = listOfLists.lists.find(list => list.name === listName);

    if (!targetList) {
      // Zoro's custom list is not created yet
      const newList = await listClient.createList({
        name: listName,
        state: 'active',
      });
      return newList.listId;
    }

    return targetList.listId;
  },

  getListItems: async(listClient, listId, status = 'active') => {
    const list = await listClient.getList(listId, status);
    if (!list.items || list.items.length === 0) {
      throw new ErrorService('EMPTY_LIST');
    }
    return list.items;
  },

  getListItemValues: listItems => listItems.map(item => item.value),

  deleteDuplicateListItem: async(listClient, listId, targetItemId) => {
    /* Get cart items */
    let listItems;
    try {
      listItems = await module.exports.getListItems(listClient, listId);
    } catch (error) {
      if (error instanceof ErrorService && error.key === 'EMPTY_LIST') {
        return false; // no deletion has be done
      }
      throw error;
    }

    /* Find and delete duplicates */
    const duplicateItem = listItems.find(listItem => listItem.value.includes(targetItemId));
    if (duplicateItem) {
      await listClient.deleteListItem(listId, duplicateItem.id);
      return true;
    }
    return false; // no deletion has be done
  },

  deleteAllActiveItems: async(listClient, listId) => {
    /* Get items in order to use their IDs for deletion */
    const listItems = await module.exports.getListItems(listClient, listId, 'active');
    // will throw error message for the case when the list is empty

    /* Delete all active list items */
    for (let i = 0; i < listItems.length; i++) {
      await listClient.deleteListItem(listId, listItems[i].id);
    }
  },

  addListItem: async(listClient, listId, listItemValue) => {
    await listClient.createListItem(listId, {
      value: listItemValue,
      status: 'active',
    });
  },

};
