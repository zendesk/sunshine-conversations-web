import WebMessenger from './web-messenger';

if (window.__onWebMessengerHostReady__) {
    window.__onWebMessengerHostReady__(WebMessenger);
} else {
    console.error('Script loader not found. Please check out the setup instructions.');
}
