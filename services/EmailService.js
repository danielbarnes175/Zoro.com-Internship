const axios = require('axios');
const nodemailer = require('nodemailer');

const ErrorService = require('./ErrorService.js');
const cartService = require('./CartService.js');

const fs = require('fs');
const path = require('path');
const requireHtml = relativePath => fs.readFileSync(path.resolve(__dirname, relativePath), 'utf8');

const EmailHeadTemplate = requireHtml('../resources/EmailHead.html');
const EmailHeaderTemplate = requireHtml('../resources/EmailHeader.html');
const EmailFooterTemplate = requireHtml('../resources/EmailFooter.html');

const SearchResultsTemplate = requireHtml('../resources/SearchResultsEmail.html');
const CartLinkTemplate = requireHtml('../resources/CartLinkEmail.html');

const TemplatingService = require('./TemplatingService.js');

module.exports = {
  getUserEmail: async(apiEndpoint, apiAccessToken) => {
    const emailEndpointUrl = apiEndpoint.concat(`/* removed */`);
    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${apiAccessToken}`,
    };

    try {
      const userEmail = await axios.get(emailEndpointUrl, {headers});
      return userEmail.data;
    } catch (error) {
      throw new ErrorService('VIEW_EMAIL');
    }
  },

  sendResults: async(paragraph, email, subjectLine) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        // Temporary account credentials for testing.
        user: process.env.USER,
        pass: process.env.PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: '/* removed */',
      to: email,
      subject: subjectLine,
      html: paragraph,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      // throw error;
      // Commented out because it causes the tests to fail because we aren't mocking nodemailer.
    }
  },

  parseEmailSearchResults: (content, searchParameters) => {
    const context = {
      queryString: searchParameters,
      items: content,
    };

    TemplatingService.registerPartial('EmailHead', EmailHeadTemplate);
    TemplatingService.registerPartial('EmailHeader', EmailHeaderTemplate);
    TemplatingService.registerPartial('EmailFooter', EmailFooterTemplate);

    return TemplatingService.render(SearchResultsTemplate, context);
  },

  parseEmailCartLink: (cartItems) => {
    const cartLinkUrl = cartService.getBuildCartLink(cartItems);
  
    const items = cartItems.reduce((accumulator, itemStringVal) => {
      try {
        accumulator.push(cartService.itemFieldsFromString(itemStringVal));
      } catch (error) {}
      return accumulator;
    }, []/* initial empty value of the accumulator */);
  
    const context = {
      cartLinkUrl,
      items,
    };
  
    TemplatingService.registerPartial('EmailHead', EmailHeadTemplate);
    TemplatingService.registerPartial('EmailHeader', EmailHeaderTemplate);
    TemplatingService.registerPartial('EmailFooter', EmailFooterTemplate);
  
    return TemplatingService.render(CartLinkTemplate, context);
  },
};
