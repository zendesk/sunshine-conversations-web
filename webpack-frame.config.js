module.exports = require('./make-webpack-config')({
    minimize: true,
    buildType: 'frame',
    sentryDsn: process.env.SENTRY_DSN
});
