const path = require('path');

module.exports = require('./make-webpack-config')({
    assetsOnly: true,
    outputPath: path.join(__dirname, 'lib/constants')
});
