module.exports = require('./make-webpack-config')({
    minimize: true,
    buildType: 'frame',
    devtool: 'source-map',
    sentryDsn: process.env.SENTRY_DSN
});
