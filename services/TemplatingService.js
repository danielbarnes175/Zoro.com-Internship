const Handlebars = require('handlebars');

module.exports = {
  render(source, context) {
    return Handlebars.compile(source)(context);
  },
  registerPartial(name, source) {
    return Handlebars.registerPartial(name, source);
  },
};
