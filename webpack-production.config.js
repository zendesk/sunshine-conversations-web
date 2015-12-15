<<<<<<< HEAD
module.exports = [
    require('./make-webpack-config')({
        longTermCaching: true,
        minimize: true,
        devtool: "source-map"
    }),
    require('./make-webpack-config')({
        prerender: true,
        minimize: true
    })
];
=======
module.exports = require('./make-webpack-config')({
    minimize: true,
    devtool: 'source-map'
});
>>>>>>> integration
