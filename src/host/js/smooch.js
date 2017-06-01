import { VERSION } from '../../shared/js/constants/version';
import hostStyles from '../stylesheets/iframe.less';
import { waitForPage } from './utils/dom';
import { init as initEnquire } from './utils/enquire';

let iframe;
const pendingOnCalls = [];
let pendingInitCall;
let pendingInitNext;
let pendingInitCatch;

const shouldRenderLink = /lebo|awle|pide|obo|rawli/i.test(navigator.userAgent);
const isPhantomJS = /PhantomJS/.test(navigator.userAgent) && process.env.NODE_ENV !== 'test';

if (!shouldRenderLink) {
    const el = document.createElement('a');
    el.href = 'https://smooch.io/live-web-chat/?utm_source=widget';
    el.text = 'Messaging by smooch.io';

    waitForPage(() => {
        document.body.appendChild(el);
    });
}

const Smooch = {
    VERSION,
    on(...args) {
        pendingOnCalls.push({
            args
        });
    },
    init(...args) {
        pendingInitCall = args;

        if (!shouldRenderLink && !isPhantomJS) {
            waitForPage(() => {
                injectFrame();
                hostStyles.use();
            });
        }

        return {
            then: (next) => pendingInitNext = next,
            catch: (next) => pendingInitCatch = next
        };
    }
};

window.__onLibReady = function onSmoochReady(Lib) {
    window.__onLibReady = function() {};
    initEnquire(iframe);
    const funcs = [
        'init',
        'login',
        'on',
        'off',
        'logout',
        'track',
        'sendMessage',
        'updateUser',
        'getConversation',
        'getUserId',
        'getCore',
        'destroy',
        'open',
        'close',
        'isOpened',
        'render'
    ];

    for (let func = funcs[0], i = 0; i < funcs.length; func = funcs[++i]) {
        Smooch[func] = Lib[func];
    }

    for (let call = pendingOnCalls[0], i = 0; i < pendingOnCalls.length; call = pendingOnCalls[++i]) {
        Lib.on(...call.args);
    }

    if (pendingInitCall) {
        const promise = Lib.init(...pendingInitCall);

        if (pendingInitNext) {
            promise.then(pendingInitNext);
        }

        if (pendingInitCatch) {
            promise.catch(pendingInitCatch);
        }
    }
};

function injectFrame() {
    iframe = document.createElement('iframe');
    iframe.className = hostStyles.ref().locals.iframe;
    let loaded = false;
    iframe.onload = () => {
        if (!loaded) {
            loaded = true;
            delete iframe.onload;
            const doc = iframe.contentWindow.document;
            doc.open();
            doc.write('<!DOCTYPE html><html><head><script src="/_assets/frame.js"></script></head></html>');
            doc.close();
        }
    };
    document.body.appendChild(iframe);
}

export default Smooch;
