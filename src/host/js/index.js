import WebMessenger from './web-messenger';

if (window.__onWebMessengerHostReady__) {
    window.__onWebMessengerHostReady__(WebMessenger);
} else if (GLOBAL_VAR_NAME) {
    // Script loader wasn't found, host bundle is being used on its own.
    global[GLOBAL_VAR_NAME] = WebMessenger;
}
