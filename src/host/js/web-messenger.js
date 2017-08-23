import hostStyles from '../stylesheets/iframe.less';
import { waitForPage } from './utils/dom';
import { init as initEnquire } from './utils/enquire';

const WebMessenger = {};
let Lib;
let iframe;

let isEmbedded;
let embeddedContainer;

let pendingInitChains = [];
let pendingOnCalls = [];
let pendingInitCall;

const shouldRenderLink = /lebo|awle|pide|obo|rawli/i.test(navigator.userAgent);
const isPhantomJS = /PhantomJS/.test(navigator.userAgent) && process.env.NODE_ENV !== 'test';

const LIB_FUNCS = [
    'init',
    'login',
    'on',
    'off',
    'logout',
    'sendMessage',
    'updateUser',
    'getConversation',
    'getUserId',
    'getCore',
    'open',
    'close',
    'isOpened'
];

if (shouldRenderLink) {
    const el = document.createElement('a');
    el.href = 'https://smooch.io/live-web-chat/?utm_source=widget';
    el.text = 'Messaging by smooch.io';

    waitForPage(() => {
        document.body.appendChild(el);
    });
}

const Skeleton = {
    VERSION,
    on(...args) {
        if (!pendingOnCalls) {
            pendingOnCalls = [];
        }

        pendingOnCalls.push({
            args
        });
    },
    init(...args) {
        pendingInitCall = args;
        isEmbedded = args.length > 0 && !!args[0].embedded;

        if (!shouldRenderLink && !isPhantomJS) {
            waitForPage(() => {
                injectFrame();
                hostStyles.use();
            });
        }

        const fakePromise = {
            then: (next) => {
                pendingInitChains.push({
                    type: 'then',
                    next
                });
                return fakePromise;
            },
            catch: (next) => {
                pendingInitChains.push({
                    type: 'catch',
                    next
                });
                return fakePromise;
            }
        };

        return fakePromise;
    },
    render(container) {
        if (iframe) {
            container.appendChild(iframe);
        } else {
            embeddedContainer = container;
        }
    },
    destroy() {
        if (Lib) {
            Lib.destroy();
            iframe.remove();
            setUp();
        }
    }
};

function setUp() {
    Lib = undefined;
    iframe = undefined;
    window.__onWebMessengerFrameReady__ = onWebMessengerReady;
    for (let func = LIB_FUNCS[0], i = 0; i < LIB_FUNCS.length; func = LIB_FUNCS[++i]) {
        if (WebMessenger[func]) {
            delete WebMessenger[func];
        }
    }
    Object.assign(WebMessenger, Skeleton);
}

function onWebMessengerReady(_Lib) {
    window.__onWebMessengerFrameReady__ = function() {};
    Lib = _Lib;
    if (!isEmbedded) {
        initEnquire(iframe);
    }

    for (let func = LIB_FUNCS[0], i = 0; i < LIB_FUNCS.length; func = LIB_FUNCS[++i]) {
        WebMessenger[func] = Lib[func];
    }

    if (pendingOnCalls) {
        for (let call = pendingOnCalls[0], i = 0; i < pendingOnCalls.length; call = pendingOnCalls[++i]) {
            Lib.on(...call.args);
        }
        pendingOnCalls = undefined;
    }


    if (pendingInitCall) {
        let promise = Lib.init(...pendingInitCall);
        pendingInitCall = undefined;

        for (let call = pendingInitChains[0], i = 0; i < pendingInitChains.length; call = pendingInitChains[++i]) {
            if (call.type === 'then') {
                promise = promise.then(call.next);
            } else {
                promise = promise.catch(call.next);
            }
        }

        pendingInitChains = undefined;
    }
}

function injectFrame() {
    if (!iframe) {
        let loaded = false;
        iframe = document.createElement('iframe');

        iframe.frameBorder = 0;
        iframe.allowFullscreen = true;
        iframe.allowTransparency = true;

        iframe.className = hostStyles.ref().locals.iframe;
        iframe.onload = () => {
            if (!loaded) {
                loaded = true;
                delete iframe.onload;
                const doc = iframe.contentWindow.document;
                doc.open();
                doc.write(`
                    <!DOCTYPE html>
                    <html>
                        <head>
                            <link rel="stylesheet" href="${FRAME_CSS_URL}" type="text/css" />
                            <script src="${FRAME_JS_URL}" async crossorigin="anonymous"></script>
                        </head>
                        <body>
                            <div id="mount"></div>
                        </body>
                    </html>
                    `);
                doc.close();
            }
        };
    }

    if (isEmbedded) {
        if (embeddedContainer) {
            embeddedContainer.appendChild(iframe);
            embeddedContainer = undefined;
        }
    } else {
        document.body.appendChild(iframe);
    }
}

setUp();

export default WebMessenger;
