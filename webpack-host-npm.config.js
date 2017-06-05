const path = require('path');
module.exports = require('./make-webpack-config')({
    hostOnly: true,
    devtool: 'source-map',
    publicPath: 'https://87a1c168.ngrok.io/',
    npmRelease: true,
    outputPath: path.join(__dirname, 'lib')
});
