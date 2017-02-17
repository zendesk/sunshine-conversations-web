module.exports = require('./make-webpack-config')({
    devServer: true,
    hotComponents: true,
    devtool: 'inline-source-map',
    debug: true
});
