/*!
 * smooch 4.0.4 
 * License : https://smooch.io/terms
 */
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "https://cdn.smooch.io/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.waitForPage = waitForPage;
exports.generateMediaQuery = generateMediaQuery;
function waitForPage(next) {
    if ((document.readyState === 'complete' || document.readyState === 'loaded' || document.readyState === 'interactive') && document.body) {
        next();
    } else {
        document.addEventListener('DOMContentLoaded', function () {
            next();
        });
    }
}

function generateMediaQuery(rule) {
    var parts = ['screen'];

    if (rule.minHeight) {
        parts.push('(min-height: ' + rule.minHeight + 'px)');
    }

    if (rule.maxHeight) {
        parts.push('(max-height: ' + rule.maxHeight + 'px)');
    }

    if (rule.minWidth) {
        parts.push('(min-width: ' + rule.minWidth + 'px)');
    }

    if (rule.maxWidth) {
        parts.push('(max-width: ' + rule.maxWidth + 'px)');
    }
    return parts.join(' and ');
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

/**
 * Helper function for iterating over a collection
 *
 * @param collection
 * @param fn
 */
function each(collection, fn) {
    var i      = 0,
        length = collection.length,
        cont;

    for(i; i < length; i++) {
        cont = fn(collection[i], i);
        if(cont === false) {
            break; //allow early exit
        }
    }
}

/**
 * Helper function for determining whether target object is an array
 *
 * @param target the object under test
 * @return {Boolean} true if array, false otherwise
 */
function isArray(target) {
    return Object.prototype.toString.apply(target) === '[object Array]';
}

/**
 * Helper function for determining whether target object is a function
 *
 * @param target the object under test
 * @return {Boolean} true if function, false otherwise
 */
function isFunction(target) {
    return typeof target === 'function';
}

module.exports = {
    isFunction : isFunction,
    isArray : isArray,
    each : each
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(3);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _iframe = __webpack_require__(4);

var _iframe2 = _interopRequireDefault(_iframe);

var _dom = __webpack_require__(0);

var _enquire = __webpack_require__(9);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var WebMessenger = {};
var Lib = void 0;
var iframe = void 0;

var isEmbedded = void 0;
var embeddedContainer = void 0;

var pendingInitChains = [];
var pendingOnCalls = [];
var pendingInitCall = void 0;

var isCrawler = /lebo|awle|pide|obo|rawli|dsbo/i.test(navigator.userAgent);
var isPhantomJS = /PhantomJS/.test(navigator.userAgent) && "production" !== 'test';

var LIB_FUNCS = ['init', 'login', 'on', 'off', 'logout', 'sendMessage', 'updateUser', 'getConversation', 'getUser', 'getCore', 'open', 'close', 'isOpened'];

if (isCrawler && !false) {
    var el = document.createElement('a');
    el.href = 'https://smooch.io/live-web-chat/?utm_source=widget';
    el.text = 'Messaging by smooch.io';

    (0, _dom.waitForPage)(function () {
        document.body.appendChild(el);
    });
}

var Skeleton = {
    VERSION: '4.0.4',
    on: function on() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        if (!pendingOnCalls) {
            pendingOnCalls = [];
        }

        pendingOnCalls.push({
            args: args
        });
    },
    init: function init() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        pendingInitCall = args;
        isEmbedded = args.length > 0 && !!args[0].embedded;

        if (!isCrawler && !isPhantomJS) {
            (0, _dom.waitForPage)(function () {
                injectFrame();
                _iframe2.default.use();
            });
        }

        var fakePromise = {
            then: function then(next) {
                pendingInitChains.push({
                    type: 'then',
                    next: next
                });
                return fakePromise;
            },
            catch: function _catch(next) {
                pendingInitChains.push({
                    type: 'catch',
                    next: next
                });
                return fakePromise;
            }
        };

        return fakePromise;
    },
    render: function render(container) {
        if (iframe) {
            container.appendChild(iframe);
        } else {
            embeddedContainer = container;
        }
    },
    destroy: function destroy() {
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
    for (var func = LIB_FUNCS[0], i = 0; i < LIB_FUNCS.length; func = LIB_FUNCS[++i]) {
        if (WebMessenger[func]) {
            delete WebMessenger[func];
        }
    }
    _extends(WebMessenger, Skeleton);
}

function onWebMessengerReady(_Lib) {
    window.__onWebMessengerFrameReady__ = function () {};
    Lib = _Lib;
    if (!isEmbedded) {
        (0, _enquire.init)(iframe);
    }

    for (var func = LIB_FUNCS[0], i = 0; i < LIB_FUNCS.length; func = LIB_FUNCS[++i]) {
        WebMessenger[func] = Lib[func];
    }

    if (pendingOnCalls) {
        for (var call = pendingOnCalls[0], _i = 0; _i < pendingOnCalls.length; call = pendingOnCalls[++_i]) {
            var _Lib2;

            (_Lib2 = Lib).on.apply(_Lib2, _toConsumableArray(call.args));
        }
        pendingOnCalls = undefined;
    }

    if (pendingInitCall) {
        var _Lib3;

        var promise = (_Lib3 = Lib).init.apply(_Lib3, _toConsumableArray(pendingInitCall));
        pendingInitCall = undefined;

        for (var _call = pendingInitChains[0], _i2 = 0; _i2 < pendingInitChains.length; _call = pendingInitChains[++_i2]) {
            if (_call.type === 'then') {
                promise = promise.then(_call.next);
            } else {
                promise = promise.catch(_call.next);
            }
        }

        pendingInitChains = undefined;
    }
}

function injectFrame() {
    if (!iframe) {
        var loaded = false;
        iframe = document.createElement('iframe');

        iframe.frameBorder = 0;
        iframe.allowFullscreen = true;
        iframe.allowTransparency = true;

        iframe.className = _iframe2.default.ref().locals.iframe;
        iframe.onload = function () {
            if (!loaded) {
                loaded = true;
                delete iframe.onload;
                var doc = iframe.contentWindow.document;
                doc.open();
                doc.write('\n                    <!DOCTYPE html>\n                    <html>\n                        <head>\n                            <link rel="stylesheet" href="' + 'https://cdn.smooch.io/frame.4.0.4.css' + '" type="text/css" />\n                            <script src="' + 'https://cdn.smooch.io/frame.4.0.4.min.js' + '" async crossorigin="anonymous"></script>\n                        </head>\n                        <body>\n                            <div id="mount"></div>\n                        </body>\n                    </html>\n                    ');
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

exports.default = WebMessenger;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var refs = 0;
var dispose;
var content = __webpack_require__(5);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) exports.locals = content.locals;
exports.use = exports.ref = function() {
	if(!(refs++)) {
		dispose = __webpack_require__(7)(content, {"insertAt":"bottom"});
	}
	return exports;
};
exports.unuse = exports.unref = function() {
       if(refs > 0 && !(--refs)) {
		dispose();
		dispose = null;
	}
};
if(false) {
	var lastRefs = module.hot.data && module.hot.data.refs || 0;
	if(lastRefs) {
		exports.ref();
		if(!content.locals) {
			refs = lastRefs;
		}
	}
	if(!content.locals) {
		module.hot.accept();
	}
	module.hot.dispose(function(data) {
		data.refs = content.locals ? 0 : refs;
		if(dispose) {
			dispose();
		}
	});
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)(true);
// imports


// module
exports.push([module.i, "@keyframes _3FxKeTOOgcsFroUq6se9N7 {\n  0% {\n    width: 434px;\n    height: 664px;\n  }\n  100% {\n    width: 70px;\n    height: 90px;\n  }\n}\n@-webkit-keyframes _3FxKeTOOgcsFroUq6se9N7 {\n  0% {\n    width: 434px;\n    height: 664px;\n  }\n  100% {\n    width: 70px;\n    height: 90px;\n  }\n}\n@keyframes _1GmqPtlICLsWVMg2Kpdx_0 {\n  0% {\n    width: 374px;\n    height: 504px;\n  }\n  100% {\n    width: 70px;\n    height: 90px;\n  }\n}\n@-webkit-keyframes _1GmqPtlICLsWVMg2Kpdx_0 {\n  0% {\n    width: 374px;\n    height: 504px;\n  }\n  100% {\n    width: 70px;\n    height: 90px;\n  }\n}\n@keyframes _36mHeCXpAKdhEsuuD5g8oV {\n  0% {\n    width: 354px;\n    height: 444px;\n  }\n  100% {\n    width: 70px;\n    height: 90px;\n  }\n}\n@-webkit-keyframes _36mHeCXpAKdhEsuuD5g8oV {\n  0% {\n    width: 354px;\n    height: 444px;\n  }\n  100% {\n    width: 70px;\n    height: 90px;\n  }\n}\n@keyframes _1ZWQW0p6AI6UGwBFbdBf9M {\n  0% {\n    width: 100%;\n    height: 100%;\n  }\n  100% {\n    width: 70px;\n    height: 90px;\n  }\n}\n@-webkit-keyframes _1ZWQW0p6AI6UGwBFbdBf9M {\n  0% {\n    width: 100%;\n    height: 100%;\n  }\n  100% {\n    width: 70px;\n    height: 90px;\n  }\n}\n._2ChX4GFAl1-UBiWknYZyEQ {\n  z-index: 9998;\n  border: none;\n  position: fixed;\n}\n.avcHn2VQJenBvoR5hilPG ._2ChX4GFAl1-UBiWknYZyEQ,\n._3fQbteJd3oQu4il3LpMKkX.avcHn2VQJenBvoR5hilPG ._2ChX4GFAl1-UBiWknYZyEQ {\n  right: 14px;\n  bottom: 20px;\n  margin-bottom: -1px;\n  width: 70px;\n  height: 90px;\n}\n@media (min-width: 1200px) and (min-height: 668px) {\n  ._3fQbteJd3oQu4il3LpMKkX.avcHn2VQJenBvoR5hilPG ._2ChX4GFAl1-UBiWknYZyEQ {\n    -webkit-animation: _3FxKeTOOgcsFroUq6se9N7 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n    animation: _3FxKeTOOgcsFroUq6se9N7 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n    -webkit-animation-delay: .2s;\n    animation-delay: .2s;\n    -webkit-animation-fill-mode: both;\n    animation-fill-mode: both;\n  }\n}\n@media (min-width: 768px) and (min-height: 508px) {\n  ._3fQbteJd3oQu4il3LpMKkX.avcHn2VQJenBvoR5hilPG ._2ChX4GFAl1-UBiWknYZyEQ {\n    -webkit-animation: _1GmqPtlICLsWVMg2Kpdx_0 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n    animation: _1GmqPtlICLsWVMg2Kpdx_0 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n    -webkit-animation-delay: .2s;\n    animation-delay: .2s;\n    -webkit-animation-fill-mode: both;\n    animation-fill-mode: both;\n  }\n}\n@media (min-width: 768px) and (max-height: 507px) {\n  ._3fQbteJd3oQu4il3LpMKkX.avcHn2VQJenBvoR5hilPG ._2ChX4GFAl1-UBiWknYZyEQ {\n    -webkit-animation: _36mHeCXpAKdhEsuuD5g8oV 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n    animation: _36mHeCXpAKdhEsuuD5g8oV 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n    -webkit-animation-delay: .2s;\n    animation-delay: .2s;\n    -webkit-animation-fill-mode: both;\n    animation-fill-mode: both;\n  }\n}\n@media (max-width: 767px) {\n  ._3fQbteJd3oQu4il3LpMKkX.avcHn2VQJenBvoR5hilPG ._2ChX4GFAl1-UBiWknYZyEQ {\n    -webkit-animation: _1ZWQW0p6AI6UGwBFbdBf9M 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n    animation: _1ZWQW0p6AI6UGwBFbdBf9M 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n    -webkit-animation-delay: 0;\n    animation-delay: 0;\n    -webkit-animation-fill-mode: both;\n    animation-fill-mode: both;\n  }\n}\n._3dtqBiGeC8k3yop4A-9Lwm ._2ChX4GFAl1-UBiWknYZyEQ,\n._3fQbteJd3oQu4il3LpMKkX._3dtqBiGeC8k3yop4A-9Lwm ._2ChX4GFAl1-UBiWknYZyEQ {\n  right: 8px;\n  height: 56px;\n  bottom: 0;\n  transition: height 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n}\n@media (max-width: 767px) {\n  ._3dtqBiGeC8k3yop4A-9Lwm ._2ChX4GFAl1-UBiWknYZyEQ,\n  ._3fQbteJd3oQu4il3LpMKkX._3dtqBiGeC8k3yop4A-9Lwm ._2ChX4GFAl1-UBiWknYZyEQ {\n    width: 100%;\n  }\n}\n@media (min-width: 768px) and (max-height: 507px) {\n  ._3dtqBiGeC8k3yop4A-9Lwm ._2ChX4GFAl1-UBiWknYZyEQ,\n  ._3fQbteJd3oQu4il3LpMKkX._3dtqBiGeC8k3yop4A-9Lwm ._2ChX4GFAl1-UBiWknYZyEQ {\n    width: 354px;\n  }\n}\n@media (min-width: 768px) and (min-height: 508px) {\n  ._3dtqBiGeC8k3yop4A-9Lwm ._2ChX4GFAl1-UBiWknYZyEQ,\n  ._3fQbteJd3oQu4il3LpMKkX._3dtqBiGeC8k3yop4A-9Lwm ._2ChX4GFAl1-UBiWknYZyEQ {\n    width: 374px;\n  }\n}\n@media (min-width: 1200px) and (min-height: 668px) {\n  ._3dtqBiGeC8k3yop4A-9Lwm ._2ChX4GFAl1-UBiWknYZyEQ,\n  ._3fQbteJd3oQu4il3LpMKkX._3dtqBiGeC8k3yop4A-9Lwm ._2ChX4GFAl1-UBiWknYZyEQ {\n    width: 434px;\n  }\n}\n@media (max-width: 767px) {\n  html._2TELtk5nDKlQudVSivRjpt,\n  html._2TELtk5nDKlQudVSivRjpt body {\n    overflow: hidden;\n    position: relative;\n    -webkit-overflow-scrolling: touch;\n    max-height: 100%;\n    height: 100%;\n    width: 100%;\n  }\n}\n@media (max-width: 767px) {\n  ._2TELtk5nDKlQudVSivRjpt ._2ChX4GFAl1-UBiWknYZyEQ {\n    width: 100%;\n    height: 100%;\n    right: 0;\n    left: 0;\n    top: 0;\n    bottom: 0;\n    max-height: 100%;\n  }\n}\n@media (min-width: 768px) and (max-height: 507px) {\n  ._2TELtk5nDKlQudVSivRjpt ._2ChX4GFAl1-UBiWknYZyEQ {\n    width: 354px;\n    height: 444px;\n  }\n}\n@media (min-width: 768px) and (min-height: 508px) {\n  ._2TELtk5nDKlQudVSivRjpt ._2ChX4GFAl1-UBiWknYZyEQ {\n    width: 374px;\n    height: 504px;\n  }\n}\n@media (min-width: 1200px) and (min-height: 668px) {\n  ._2TELtk5nDKlQudVSivRjpt ._2ChX4GFAl1-UBiWknYZyEQ {\n    width: 434px;\n    height: 664px;\n  }\n}\n._24n-ftZlG3wDvoWFR8zUnn ._2ChX4GFAl1-UBiWknYZyEQ {\n  position: relative;\n  height: 100%;\n  width: 100%;\n  max-height: 100%;\n}\n", "", {"version":3,"sources":["/home/ubuntu/smooch-web/src/host/stylesheets/animations.less","/home/ubuntu/smooch-web/src/host/stylesheets/iframe.less","/home/ubuntu/smooch-web/src/host/stylesheets/iframe.less"],"names":[],"mappings":"AAAA;EACI;IACI,aAAA;IACA,cAAA;GCCL;EDCC;IECA,YAAA;IACA,aAAA;GDCD;CACF;ADCD;EACI;IACI,aAAA;IACA,cAAA;GCCL;EDCC;IETA,YAAA;IACA,aAAA;GDWD;CACF;ADCD;EACI;IACI,aAAA;IACA,cAAA;GCCL;EDCC;IEnBA,YAAA;IACA,aAAA;GDqBD;CACF;ADCD;EACI;IACI,aAAA;IACA,cAAA;GCCL;EDCC;IE7BA,YAAA;IACA,aAAA;GD+BD;CACF;ADCD;EACI;IACI,aAAA;IACA,cAAA;GCCL;EDCC;IEvCA,YAAA;IACA,aAAA;GDyCD;CACF;ADCD;EACI;IACI,aAAA;IACA,cAAA;GCCL;EDCC;IEjDA,YAAA;IACA,aAAA;GDmDD;CACF;ADCD;EACI;IACI,YAAA;IACA,aAAA;GCCL;EDCC;IE3DA,YAAA;IACA,aAAA;GD6DD;CACF;ADCD;EACI;IACI,YAAA;IACA,aAAA;GCCL;EDCC;IErEA,YAAA;IACA,aAAA;GDuED;CACF;ACrED;EAEQ,cAAA;EACA,aAAA;EACA,gBAAA;CDsEP;AC1ED;;EAQQ,YAAA;EACA,aAAA;EACA,oBAAA;EAdJ,YAAA;EACA,aAAA;CDqFH;AC3DO;EA0FR;IAjGY,qFAAA;IACQ,6EAAA;IACR,6BAAA;IACQ,qBAAA;IACR,kCAAA;IACQ,0BAAA;GDsEjB;CACF;AC7DO;EAkFR;IAzFY,qFAAA;IACQ,6EAAA;IACR,6BAAA;IACQ,qBAAA;IACR,kCAAA;IACQ,0BAAA;GDwEjB;CACF;AC/DO;EA0ER;IAjFY,qFAAA;IACQ,6EAAA;IACR,6BAAA;IACQ,qBAAA;IACR,kCAAA;IACQ,0BAAA;GD0EjB;CACF;ACjEG;EAkEJ;IAzEY,qFAAA;IACQ,6EAAA;IACR,2BAAA;IACQ,mBAAA;IACR,kCAAA;IACQ,0BAAA;GD4EjB;CACF;AC1HD;;EAkDQ,WAAA;EACA,aAAA;EACA,UAAA;EACA,6DAAA;CD4EP;ACvEO;EAuDR;;IAzDY,YAAA;GD8ET;CACF;AC1EO;EAoDR;;IAtDY,aAAA;GDiFT;CACF;AC7EO;EAiDR;;IAnDY,aAAA;GDoFT;CACF;AChFG;EA8CJ;;IAhDY,aAAA;GDuFT;CACF;AC1EO;EAkCR;;IAzCgB,iBAAA;IACA,mBAAA;IACA,kCAAA;IACA,iBAAA;IACA,aAAA;IACA,YAAA;GDsFb;CACF;ACxEO;EAqBR;IA7BY,YAAA;IACA,aAAA;IACA,SAAA;IACA,QAAA;IACA,OAAA;IACA,UAAA;IACA,iBAAA;GDoFT;CACF;AC/EO;EAiBR;IApBY,aAAA;IACA,cAAA;GDsFT;CACF;ACjFO;EAaR;IAhBY,aAAA;IACA,cAAA;GDwFT;CACF;ACnFG;EASJ;IAZY,aAAA;IACA,cAAA;GD0FT;CACF;ACjMD;EA2GQ,mBAAA;EACA,aAAA;EACA,YAAA;EACA,iBAAA;CDyFP","file":"iframe.less","sourcesContent":["@keyframes iframe-button-close-lg {\n    0% {\n        width: @frame-width-lg;\n        height: @frame-height-lg;\n    }\n    100% {\n        .button-size();\n    }\n}\n\n@-webkit-keyframes iframe-button-close-lg {\n    0% {\n        width: @frame-width-lg;\n        height: @frame-height-lg;\n    }\n    100% {\n        .button-size();\n    }\n}\n\n@keyframes iframe-button-close-md {\n    0% {\n        width: @frame-width-md;\n        height: @frame-height-md;\n    }\n    100% {\n        .button-size();\n    }\n}\n\n@-webkit-keyframes iframe-button-close-md {\n    0% {\n        width: @frame-width-md;\n        height: @frame-height-md;\n    }\n    100% {\n        .button-size();\n    }\n}\n\n@keyframes iframe-button-close-sm {\n    0% {\n        width: @frame-width-sm;\n        height: @frame-height-sm;\n    }\n    100% {\n        .button-size();\n    }\n}\n\n@-webkit-keyframes iframe-button-close-sm {\n    0% {\n        width: @frame-width-sm;\n        height: @frame-height-sm;\n    }\n    100% {\n        .button-size();\n    }\n}\n\n@keyframes iframe-button-close-xs {\n    0% {\n        width: @frame-width-xs;\n        height: @frame-height-xs;\n    }\n    100% {\n        .button-size();\n    }\n}\n\n@-webkit-keyframes iframe-button-close-xs {\n    0% {\n        width: @frame-width-xs;\n        height: @frame-height-xs;\n    }\n    100% {\n        .button-size();\n    }\n}\n","@keyframes iframe-button-close-lg {\n  0% {\n    width: 434px;\n    height: 664px;\n  }\n  100% {\n    width: 70px;\n    height: 90px;\n  }\n}\n@-webkit-keyframes iframe-button-close-lg {\n  0% {\n    width: 434px;\n    height: 664px;\n  }\n  100% {\n    width: 70px;\n    height: 90px;\n  }\n}\n@keyframes iframe-button-close-md {\n  0% {\n    width: 374px;\n    height: 504px;\n  }\n  100% {\n    width: 70px;\n    height: 90px;\n  }\n}\n@-webkit-keyframes iframe-button-close-md {\n  0% {\n    width: 374px;\n    height: 504px;\n  }\n  100% {\n    width: 70px;\n    height: 90px;\n  }\n}\n@keyframes iframe-button-close-sm {\n  0% {\n    width: 354px;\n    height: 444px;\n  }\n  100% {\n    width: 70px;\n    height: 90px;\n  }\n}\n@-webkit-keyframes iframe-button-close-sm {\n  0% {\n    width: 354px;\n    height: 444px;\n  }\n  100% {\n    width: 70px;\n    height: 90px;\n  }\n}\n@keyframes iframe-button-close-xs {\n  0% {\n    width: 100%;\n    height: 100%;\n  }\n  100% {\n    width: 70px;\n    height: 90px;\n  }\n}\n@-webkit-keyframes iframe-button-close-xs {\n  0% {\n    width: 100%;\n    height: 100%;\n  }\n  100% {\n    width: 70px;\n    height: 90px;\n  }\n}\n:local .iframe {\n  z-index: 9998;\n  border: none;\n  position: fixed;\n}\n:local .displayButton .iframe,\n:local .widgetClosed.displayButton .iframe {\n  right: 14px;\n  bottom: 20px;\n  margin-bottom: -1px;\n  width: 70px;\n  height: 90px;\n}\n@media (min-width: 1200px) and (min-height: 668px) {\n  :local .widgetClosed.displayButton .iframe {\n    -webkit-animation: iframe-button-close-lg 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n    animation: iframe-button-close-lg 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n    -webkit-animation-delay: .2s;\n    animation-delay: .2s;\n    -webkit-animation-fill-mode: both;\n    animation-fill-mode: both;\n  }\n}\n@media (min-width: 768px) and (min-height: 508px) {\n  :local .widgetClosed.displayButton .iframe {\n    -webkit-animation: iframe-button-close-md 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n    animation: iframe-button-close-md 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n    -webkit-animation-delay: .2s;\n    animation-delay: .2s;\n    -webkit-animation-fill-mode: both;\n    animation-fill-mode: both;\n  }\n}\n@media (min-width: 768px) and (max-height: 507px) {\n  :local .widgetClosed.displayButton .iframe {\n    -webkit-animation: iframe-button-close-sm 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n    animation: iframe-button-close-sm 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n    -webkit-animation-delay: .2s;\n    animation-delay: .2s;\n    -webkit-animation-fill-mode: both;\n    animation-fill-mode: both;\n  }\n}\n@media (max-width: 767px) {\n  :local .widgetClosed.displayButton .iframe {\n    -webkit-animation: iframe-button-close-xs 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n    animation: iframe-button-close-xs 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n    -webkit-animation-delay: 0;\n    animation-delay: 0;\n    -webkit-animation-fill-mode: both;\n    animation-fill-mode: both;\n  }\n}\n:local .displayTab .iframe,\n:local .widgetClosed.displayTab .iframe {\n  right: 8px;\n  height: 56px;\n  bottom: 0;\n  transition: height 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n}\n@media (max-width: 767px) {\n  :local .displayTab .iframe,\n  :local .widgetClosed.displayTab .iframe {\n    width: 100%;\n  }\n}\n@media (min-width: 768px) and (max-height: 507px) {\n  :local .displayTab .iframe,\n  :local .widgetClosed.displayTab .iframe {\n    width: 354px;\n  }\n}\n@media (min-width: 768px) and (min-height: 508px) {\n  :local .displayTab .iframe,\n  :local .widgetClosed.displayTab .iframe {\n    width: 374px;\n  }\n}\n@media (min-width: 1200px) and (min-height: 668px) {\n  :local .displayTab .iframe,\n  :local .widgetClosed.displayTab .iframe {\n    width: 434px;\n  }\n}\n@media (max-width: 767px) {\n  :local html.widgetOpened,\n  :local html.widgetOpened body {\n    overflow: hidden;\n    position: relative;\n    -webkit-overflow-scrolling: touch;\n    max-height: 100%;\n    height: 100%;\n    width: 100%;\n  }\n}\n@media (max-width: 767px) {\n  :local .widgetOpened .iframe {\n    width: 100%;\n    height: 100%;\n    right: 0;\n    left: 0;\n    top: 0;\n    bottom: 0;\n    max-height: 100%;\n  }\n}\n@media (min-width: 768px) and (max-height: 507px) {\n  :local .widgetOpened .iframe {\n    width: 354px;\n    height: 444px;\n  }\n}\n@media (min-width: 768px) and (min-height: 508px) {\n  :local .widgetOpened .iframe {\n    width: 374px;\n    height: 504px;\n  }\n}\n@media (min-width: 1200px) and (min-height: 668px) {\n  :local .widgetOpened .iframe {\n    width: 434px;\n    height: 664px;\n  }\n}\n:local .widgetEmbedded .iframe {\n  position: relative;\n  height: 100%;\n  width: 100%;\n  max-height: 100%;\n}\n","@import \"../../shared/stylesheets/bootstrap/mixins.less\";\n@import \"../../shared/stylesheets/bootstrap/variables.less\";\n@import \"../../shared/stylesheets/variables.less\";\n@import \"animations.less\";\n\n.button-size() {\n    width: @messenger-button-size + @messenger-button-shadow-width * 2;\n    height: @messenger-button-size + @widget-messenger-button-vertical-spacing + @messenger-button-shadow-width * 2;\n}\n\n:local {\n    .iframe {\n        z-index: 9998; // 1 less than Stripe Checkout\n        border: none;\n        position: fixed;\n    }\n\n    .displayButton .iframe, .widgetClosed.displayButton .iframe {\n        right: @widget-horizontal-spacing - @messenger-button-shadow-width;\n        bottom: @widget-vertical-spacing;\n        margin-bottom: -1px;\n        .button-size();\n    }\n\n    .widgetClosed.displayButton .iframe {\n        @media (min-width: @screen-lg-min) and (min-height: @screen-md-ht-min) {\n            -webkit-animation: iframe-button-close-lg .4s cubic-bezier(.62, .28, .23, .99);\n                    animation: iframe-button-close-lg .4s cubic-bezier(.62, .28, .23, .99);\n            -webkit-animation-delay: .2s;\n                    animation-delay: .2s;\n            -webkit-animation-fill-mode: both;\n                    animation-fill-mode: both;\n        }\n        @media (min-width: @screen-sm-min) and (min-height: @screen-sm-ht-min) {\n            -webkit-animation: iframe-button-close-md .4s cubic-bezier(.62, .28, .23, .99);\n                    animation: iframe-button-close-md .4s cubic-bezier(.62, .28, .23, .99);\n            -webkit-animation-delay: .2s;\n                    animation-delay: .2s;\n            -webkit-animation-fill-mode: both;\n                    animation-fill-mode: both;\n        }\n        @media (min-width: @screen-sm-min) and (max-height: @screen-xs-ht-max) {\n            -webkit-animation: iframe-button-close-sm .4s cubic-bezier(.62, .28, .23, .99);\n                    animation: iframe-button-close-sm .4s cubic-bezier(.62, .28, .23, .99);\n            -webkit-animation-delay: .2s;\n                    animation-delay: .2s;\n            -webkit-animation-fill-mode: both;\n                    animation-fill-mode: both;\n        }\n        @media (max-width: @screen-xs-max) {\n            -webkit-animation: iframe-button-close-xs .4s cubic-bezier(.62, .28, .23, .99);\n                    animation: iframe-button-close-xs .4s cubic-bezier(.62, .28, .23, .99);\n            -webkit-animation-delay: 0;\n                    animation-delay: 0;\n            -webkit-animation-fill-mode: both;\n                    animation-fill-mode: both;\n        }\n    }\n\n    .displayTab .iframe, .widgetClosed.displayTab .iframe {\n        right: @widget-horizontal-spacing - @widget-box-shadow-width;\n        height: @header-height + @widget-box-shadow-width;\n        bottom: 0;\n        transition: height .4s cubic-bezier(.62, .28, .23, .99);\n\n        @media (max-width: @screen-xs-max) {\n            width: @frame-width-xs;\n        }\n        @media (min-width: @screen-sm-min) and (max-height: @screen-xs-ht-max) {\n            width: @frame-width-sm;\n        }\n        @media (min-width: @screen-sm-min) and (min-height: @screen-sm-ht-min) {\n            width: @frame-width-md;\n        }\n        @media (min-width: @screen-lg-min) and (min-height: @screen-md-ht-min) {\n            width: @frame-width-lg;\n        }\n    }\n\n    html.widgetOpened {\n        &, body {\n            @media (max-width: @screen-xs-max) {\n                overflow: hidden;\n                position: relative;\n                -webkit-overflow-scrolling: touch;\n                max-height: 100%;\n                height: 100%;\n                width: 100%;\n            }\n        }\n    }\n\n    .widgetOpened .iframe {\n        @media (max-width: @screen-xs-max) {\n            width: @frame-width-xs;\n            height: @frame-height-xs;\n            right: 0;\n            left: 0;\n            top: 0;\n            bottom: 0;\n            max-height: 100%;\n        }\n        @media (min-width: @screen-sm-min) and (max-height: @screen-xs-ht-max) {\n            width: @frame-width-sm;\n            height: @frame-height-sm;\n        }\n        @media (min-width: @screen-sm-min) and (min-height: @screen-sm-ht-min) {\n            width: @frame-width-md;\n            height: @frame-height-md;\n        }\n        @media (min-width: @screen-lg-min) and (min-height: @screen-md-ht-min) {\n            width: @frame-width-lg;\n            height: @frame-height-lg;\n        }\n    }\n\n    .widgetEmbedded .iframe {\n        position: relative;\n        height: 100%;\n        width: 100%;\n        max-height: 100%;\n    }\n}\n"],"sourceRoot":""}]);

// exports
exports.locals = {
	"iframe": "_2ChX4GFAl1-UBiWknYZyEQ",
	"displayButton": "avcHn2VQJenBvoR5hilPG",
	"widgetClosed": "_3fQbteJd3oQu4il3LpMKkX",
	"iframe-button-close-lg": "_3FxKeTOOgcsFroUq6se9N7",
	"iframe-button-close-md": "_1GmqPtlICLsWVMg2Kpdx_0",
	"iframe-button-close-sm": "_36mHeCXpAKdhEsuuD5g8oV",
	"iframe-button-close-xs": "_1ZWQW0p6AI6UGwBFbdBf9M",
	"displayTab": "_3dtqBiGeC8k3yop4A-9Lwm",
	"widgetOpened": "_2TELtk5nDKlQudVSivRjpt",
	"widgetEmbedded": "_24n-ftZlG3wDvoWFR8zUnn"
};

/***/ }),
/* 6 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(8);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 8 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.init = init;

var _enquire = __webpack_require__(10);

var _enquire2 = _interopRequireDefault(_enquire);

var _sizes = __webpack_require__(14);

var _dom = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sizes = ['lg', 'md', 'sm', 'xs'];

function init(iframe) {
    var _loop = function _loop(i) {
        var size = sizes[i];

        var rules = _sizes.SCREEN_SIZES[size];
        // polyfill for Array.isArray
        if (Object.prototype.toString.call(rules) !== '[object Array]') {
            rules = [rules];
        }

        for (var j = 0; j < rules.length; j++) {
            var rule = rules[j];

            _enquire2.default.register((0, _dom.generateMediaQuery)(rule), function () {
                iframe.contentWindow.postMessage({
                    type: 'sizeChange',
                    value: size
                }, location.protocol + '//' + location.host);
            });
        }
    };

    for (var i = 0; i < sizes.length; i++) {
        _loop(i);
    }
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var MediaQueryDispatch = __webpack_require__(11);
module.exports = new MediaQueryDispatch();


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var MediaQuery = __webpack_require__(12);
var Util = __webpack_require__(1);
var each = Util.each;
var isFunction = Util.isFunction;
var isArray = Util.isArray;

/**
 * Allows for registration of query handlers.
 * Manages the query handler's state and is responsible for wiring up browser events
 *
 * @constructor
 */
function MediaQueryDispatch () {
    if(!window.matchMedia) {
        throw new Error('matchMedia not present, legacy browsers require a polyfill');
    }

    this.queries = {};
    this.browserIsIncapable = !window.matchMedia('only all').matches;
}

MediaQueryDispatch.prototype = {

    constructor : MediaQueryDispatch,

    /**
     * Registers a handler for the given media query
     *
     * @param {string} q the media query
     * @param {object || Array || Function} options either a single query handler object, a function, or an array of query handlers
     * @param {function} options.match fired when query matched
     * @param {function} [options.unmatch] fired when a query is no longer matched
     * @param {function} [options.setup] fired when handler first triggered
     * @param {boolean} [options.deferSetup=false] whether setup should be run immediately or deferred until query is first matched
     * @param {boolean} [shouldDegrade=false] whether this particular media query should always run on incapable browsers
     */
    register : function(q, options, shouldDegrade) {
        var queries         = this.queries,
            isUnconditional = shouldDegrade && this.browserIsIncapable;

        if(!queries[q]) {
            queries[q] = new MediaQuery(q, isUnconditional);
        }

        //normalise to object in an array
        if(isFunction(options)) {
            options = { match : options };
        }
        if(!isArray(options)) {
            options = [options];
        }
        each(options, function(handler) {
            if (isFunction(handler)) {
                handler = { match : handler };
            }
            queries[q].addHandler(handler);
        });

        return this;
    },

    /**
     * unregisters a query and all it's handlers, or a specific handler for a query
     *
     * @param {string} q the media query to target
     * @param {object || function} [handler] specific handler to unregister
     */
    unregister : function(q, handler) {
        var query = this.queries[q];

        if(query) {
            if(handler) {
                query.removeHandler(handler);
            }
            else {
                query.clear();
                delete this.queries[q];
            }
        }

        return this;
    }
};

module.exports = MediaQueryDispatch;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var QueryHandler = __webpack_require__(13);
var each = __webpack_require__(1).each;

/**
 * Represents a single media query, manages it's state and registered handlers for this query
 *
 * @constructor
 * @param {string} query the media query string
 * @param {boolean} [isUnconditional=false] whether the media query should run regardless of whether the conditions are met. Primarily for helping older browsers deal with mobile-first design
 */
function MediaQuery(query, isUnconditional) {
    this.query = query;
    this.isUnconditional = isUnconditional;
    this.handlers = [];
    this.mql = window.matchMedia(query);

    var self = this;
    this.listener = function(mql) {
        // Chrome passes an MediaQueryListEvent object, while other browsers pass MediaQueryList directly
        self.mql = mql.currentTarget || mql;
        self.assess();
    };
    this.mql.addListener(this.listener);
}

MediaQuery.prototype = {

    constuctor : MediaQuery,

    /**
     * add a handler for this query, triggering if already active
     *
     * @param {object} handler
     * @param {function} handler.match callback for when query is activated
     * @param {function} [handler.unmatch] callback for when query is deactivated
     * @param {function} [handler.setup] callback for immediate execution when a query handler is registered
     * @param {boolean} [handler.deferSetup=false] should the setup callback be deferred until the first time the handler is matched?
     */
    addHandler : function(handler) {
        var qh = new QueryHandler(handler);
        this.handlers.push(qh);

        this.matches() && qh.on();
    },

    /**
     * removes the given handler from the collection, and calls it's destroy methods
     *
     * @param {object || function} handler the handler to remove
     */
    removeHandler : function(handler) {
        var handlers = this.handlers;
        each(handlers, function(h, i) {
            if(h.equals(handler)) {
                h.destroy();
                return !handlers.splice(i,1); //remove from array and exit each early
            }
        });
    },

    /**
     * Determine whether the media query should be considered a match
     *
     * @return {Boolean} true if media query can be considered a match, false otherwise
     */
    matches : function() {
        return this.mql.matches || this.isUnconditional;
    },

    /**
     * Clears all handlers and unbinds events
     */
    clear : function() {
        each(this.handlers, function(handler) {
            handler.destroy();
        });
        this.mql.removeListener(this.listener);
        this.handlers.length = 0; //clear array
    },

    /*
        * Assesses the query, turning on all handlers if it matches, turning them off if it doesn't match
        */
    assess : function() {
        var action = this.matches() ? 'on' : 'off';

        each(this.handlers, function(handler) {
            handler[action]();
        });
    }
};

module.exports = MediaQuery;


/***/ }),
/* 13 */
/***/ (function(module, exports) {

/**
 * Delegate to handle a media query being matched and unmatched.
 *
 * @param {object} options
 * @param {function} options.match callback for when the media query is matched
 * @param {function} [options.unmatch] callback for when the media query is unmatched
 * @param {function} [options.setup] one-time callback triggered the first time a query is matched
 * @param {boolean} [options.deferSetup=false] should the setup callback be run immediately, rather than first time query is matched?
 * @constructor
 */
function QueryHandler(options) {
    this.options = options;
    !options.deferSetup && this.setup();
}

QueryHandler.prototype = {

    constructor : QueryHandler,

    /**
     * coordinates setup of the handler
     *
     * @function
     */
    setup : function() {
        if(this.options.setup) {
            this.options.setup();
        }
        this.initialised = true;
    },

    /**
     * coordinates setup and triggering of the handler
     *
     * @function
     */
    on : function() {
        !this.initialised && this.setup();
        this.options.match && this.options.match();
    },

    /**
     * coordinates the unmatch event for the handler
     *
     * @function
     */
    off : function() {
        this.options.unmatch && this.options.unmatch();
    },

    /**
     * called when a handler is to be destroyed.
     * delegates to the destroy or unmatch callbacks, depending on availability.
     *
     * @function
     */
    destroy : function() {
        this.options.destroy ? this.options.destroy() : this.off();
    },

    /**
     * determines equality by reference.
     * if object is supplied compare options, if function, compare match callback
     *
     * @function
     * @param {object || function} [target] the target for comparison
     */
    equals : function(target) {
        return this.options === target || this.options.match === target;
    }

};

module.exports = QueryHandler;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var SCREEN_SIZES = exports.SCREEN_SIZES = {
    lg: {
        minHeight: 668,
        minWidth: 1200
    },
    md: [{
        minHeight: 508,
        minWidth: 768,
        maxWidth: 1199
    }, {
        minHeight: 508,
        maxHeight: 667,
        minWidth: 768
    }],
    sm: {
        maxHeight: 507,
        minWidth: 768
    },
    xs: {
        maxWidth: 767
    }
};

/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map