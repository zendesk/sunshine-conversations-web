const path = require('path');
module.exports = require('./make-webpack-config')({
    hostOnly: true,
    devtool: 'source-map',
    npmRelease: true,
    outputPath: path.join(__dirname, 'lib')
});
