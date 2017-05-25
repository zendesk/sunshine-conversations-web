import { VERSION } from '../../shared/js/constants/version';
import hostStyles from '../stylesheets/iframe.less';
import { waitForPage } from './utils/dom';

const pendingOnCalls = [];
let pendingInitCall;
let pendingInitNext;
let pendingInitCatch;


const Smooch = {
    VERSION,
    on(...args) {
        pendingOnCalls.push({
            args
        });
    },
    init(...args) {
        pendingInitCall = args;
        waitForPage(() => {
            injectFrame();
            hostStyles.use();
        });
        return {
            then: (next) => pendingInitNext = next,
            catch: (next) => pendingInitCatch = next
        };
    }
};

let isSmoochReady = false;
window.__onLibReady = function onSmoochReady(Lib) {
    if (!isSmoochReady) {
        isSmoochReady = true;
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
            Smooch[func] = Lib[func].bind(Lib);
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
    }
};

function injectFrame() {
    const iframe = document.createElement('iframe');
    iframe.className = hostStyles.ref().locals.iframe;
    let loaded = false;
    iframe.onload = () => {
        if (!loaded) {
            loaded = true;
            delete iframe.onload;
            iframe.contentWindow.__readyFnName = 'xyz';
            iframe.contentWindow.__frameContainer = iframe;

            const doc = iframe.contentWindow.document;
            doc.open();
            doc.write('<!DOCTYPE html><html><head><meta name="viewport" content="initial-scale=1.0, user-scalable=no"><script src="/_assets/frame.js"></script></head></html>');
            doc.close();
        }
    };
    document.body.appendChild(iframe);
}

export default Smooch;
