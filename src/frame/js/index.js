import './utils/polyfills';
import './utils/raven';
import * as WebMessenger from './web-messenger';
parent.window.__onWebMessengerFrameReady__(WebMessenger);
