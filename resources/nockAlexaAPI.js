const nock = require('nock');

const ALEXA_ENDPOINT = 'https://api.amazonalexa.com';
const NOCK_ID = 'nock_id';

module.exports = {
  META_DATA: {
    nock_id: {
      lists: [
        {
          listId: NOCK_ID,
          name: 'Zoro Shopping Cart',
          state: 'active',
          version: 1,
          statusMap: [
            {
              href: 'url',	// URL to get active list items in the list.
              status: 'active',
            },
            {
              href: 'url',
              status: 'completed',
            },
          ],
        },
      ],
    },
    wrongListName: {
      lists: [
        {
          listId: NOCK_ID,
          name: 'Super Zoro Shopping Cart',
          state: 'active',
          version: 1,
          statusMap: [
            {
              href: 'url',	// URL to get active list items in the list.
              status: 'active',
            },
            {
              href: 'url',
              status: 'completed',
            },
          ],
        },
      ],
    },
  },

  LIST_DATA: {
    empty: {
      listId: NOCK_ID,
      name: 'Zoro Shopping Cart',
      state: 'active',
      version: 7,
      items: [],
      /* "links": {
        "next": "v2/householdlists/nock_id/active?nextToken={nextToken}"
      } */
    },
    oneItem: {
      listId: NOCK_ID,
      name: 'Zoro Shopping Cart',
      state: 'active',
      version: 7,
      items: [
        {
          id: 'mock_item_id',
          version: 7,
          value: '2 ------ Shockwave™ 2" Impact Phillips #2 Power Insert Bits, 15 pk. (ID: G4299994) (Price: $1.00)',
          status: 'active',
          /*
          "createdTime": , // created time in format Wed Jul 19 23:24:10 UTC 2017
          "updatedTime": , // updated time in format Wed Jul 19 23:24:10 UTC 2017
          "href": // URL to retrieve the item (String)
          */
        },
      ],
    },
    invalidItems: {
      listId: NOCK_ID,
      name: 'Zoro Shopping Cart',
      state: 'active',
      version: 7,
      items: [
        {
          id: 'mock_item_id',
          version: 7,
          value: 'Hello',
          status: 'active',
        },
        {
          id: 'mock_item_id_1',
          version: 7,
          value: 'Hello --- Bye',
          status: 'active',
        },
        {
          id: 'mock_item_id_2',
          version: 7,
          value: '4000 --- Bye (ID: Godfather)',
          status: 'active',
        },
      ],
    },
  },

  cleanAll: () => nock.cleanAll(),

  nockAccessList: (listType, listMetaData = NOCK_ID) => {
    // mock create list
    nock(ALEXA_ENDPOINT)
      .post('/v2/householdlists/')
      .reply(201, module.exports.META_DATA[NOCK_ID].lists[0]);

    // mock get list id
    nock(ALEXA_ENDPOINT)
      .get('/v2/householdlists/')
      .reply(200, module.exports.META_DATA[listMetaData]);

    // mock get list
    nock(ALEXA_ENDPOINT)
      .get(`/v2/householdlists/${NOCK_ID}/active/`)
      .reply(200, module.exports.LIST_DATA[listType]);

    // mock create list item
    nock(ALEXA_ENDPOINT)
      .persist()
      .post(`/v2/householdlists/${NOCK_ID}/items/`)
      .reply(201);

    // mock delete list item
    if (listType !== 'empty') {
      nock(ALEXA_ENDPOINT)
        // the below regex: /v2/householdlists/{ANY_LIST_ID}/items/{ANY_ITEM_ID}/
        .delete(/\/v2\/householdlists\/.+\/items\/.+\//i)
        .reply(200);
    }
  },

  nockGetListWithError: (listMetaData = NOCK_ID) => {
    // mock create list
    nock(ALEXA_ENDPOINT)
      .post('/v2/householdlists/')
      .reply(201, module.exports.META_DATA[NOCK_ID].lists[0]);

    // mock get list id
    nock(ALEXA_ENDPOINT)
      .get('/v2/householdlists/')
      .reply(200, module.exports.META_DATA[listMetaData]);

    // mock get list
    nock(ALEXA_ENDPOINT)
      .get(`/v2/householdlists/${NOCK_ID}/active/`)
      .reply(400);
  },


};
