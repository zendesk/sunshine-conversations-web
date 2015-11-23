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
