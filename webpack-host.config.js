module.exports = require('./make-webpack-config')({
    minimize: true,
    hostOnly: true,
    devtool: 'source-map',
    publicPath: 'https://87a1c168.ngrok.io/'
});
