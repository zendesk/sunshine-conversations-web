const {stylesheet} = require('./utils/assets');
stylesheet.use();

const {Smooch} = require('./smooch');

module.exports = new Smooch();
