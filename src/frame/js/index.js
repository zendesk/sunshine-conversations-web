require('./utils/raven');
const {setUp} = require('./utils/polyfills');
setUp().then(() => {
    const WebMessenger = require('./web-messenger');
    parent.window.__onWebMessengerFrameReady__(WebMessenger);
});
