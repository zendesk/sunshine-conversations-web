const stylesheet = require('./utils/assets').stylesheet;
stylesheet.use();

const Smooch = require('./smooch').Smooch;

module.exports = new Smooch();
