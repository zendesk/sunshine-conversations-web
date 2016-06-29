module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "https://cdn.smooch.io/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	var stylesheet = exports.stylesheet = __webpack_require__(106);
	var logo = exports.logo = __webpack_require__(111);
	var logo2x = exports.logo2x = __webpack_require__(112);
	var soundNotification = exports.soundNotification = __webpack_require__(113);

	var integrations = exports.integrations = {
	    messenger: {
	        icon: __webpack_require__(114),
	        icon2x: __webpack_require__(115),
	        iconLarge: __webpack_require__(116),
	        iconLarge2x: __webpack_require__(117)
	    },
	    line: {
	        icon: __webpack_require__(118),
	        icon2x: __webpack_require__(119),
	        iconLarge: __webpack_require__(120),
	        iconLarge2x: __webpack_require__(121)
	    },
	    wechat: {
	        icon: __webpack_require__(122),
	        icon2x: __webpack_require__(123),
	        iconLarge: __webpack_require__(124),
	        iconLarge2x: __webpack_require__(125)
	    },
	    telegram: {
	        icon: __webpack_require__(126),
	        icon2x: __webpack_require__(127),
	        iconLarge: __webpack_require__(128),
	        iconLarge2x: __webpack_require__(129)
	    },
	    frontendEmail: {
	        icon: __webpack_require__(130),
	        icon2x: __webpack_require__(131),
	        iconLarge: __webpack_require__(132),
	        iconLarge2x: __webpack_require__(133)
	    },
	    sms: {
	        icon: __webpack_require__(134),
	        icon2x: __webpack_require__(135),
	        iconLarge: __webpack_require__(136),
	        iconLarge2x: __webpack_require__(137)
	    }
	};

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	var refs = 0;
	var dispose;
	var content = __webpack_require__(107);
	if(typeof content === 'string') content = [[module.id, content, '']];
	exports.use = exports.ref = function() {
		if(!(refs++)) {
			exports.locals = content.locals;
			dispose = __webpack_require__(110)(content);
		}
		return exports;
	};
	exports.unuse = exports.unref = function() {
		if(!(--refs)) {
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

/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(108)();
	// imports
	exports.i(__webpack_require__(109), "");

	// module
	exports.push([module.id, "#sk-holder {\n  /* Eric Meyer's Reset CSS v2.0 - http://cssreset.com */\n}\n#sk-holder .sk-fading-circle {\n  width: 15px;\n  height: 15px;\n  position: relative;\n}\n#sk-holder .sk-fading-circle .sk-circle {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  left: 0;\n  top: 0;\n}\n#sk-holder .sk-fading-circle .sk-circle:before {\n  content: '';\n  display: block;\n  margin: 0 auto;\n  width: 15%;\n  height: 15%;\n  background-color: white;\n  border-radius: 100%;\n  -webkit-animation: sk-circleFadeDelay 1.2s infinite ease-in-out both;\n  animation: sk-circleFadeDelay 1.2s infinite ease-in-out both;\n}\n#sk-holder .sk-fading-circle.dark .sk-circle:before {\n  background-color: #787f8c;\n}\n#sk-holder .sk-fading-circle .sk-circle2 {\n  -webkit-transform: rotate(30deg);\n  -ms-transform: rotate(30deg);\n  transform: rotate(30deg);\n}\n#sk-holder .sk-fading-circle .sk-circle3 {\n  -webkit-transform: rotate(60deg);\n  -ms-transform: rotate(60deg);\n  transform: rotate(60deg);\n}\n#sk-holder .sk-fading-circle .sk-circle4 {\n  -webkit-transform: rotate(90deg);\n  -ms-transform: rotate(90deg);\n  transform: rotate(90deg);\n}\n#sk-holder .sk-fading-circle .sk-circle5 {\n  -webkit-transform: rotate(120deg);\n  -ms-transform: rotate(120deg);\n  transform: rotate(120deg);\n}\n#sk-holder .sk-fading-circle .sk-circle6 {\n  -webkit-transform: rotate(150deg);\n  -ms-transform: rotate(150deg);\n  transform: rotate(150deg);\n}\n#sk-holder .sk-fading-circle .sk-circle7 {\n  -webkit-transform: rotate(180deg);\n  -ms-transform: rotate(180deg);\n  transform: rotate(180deg);\n}\n#sk-holder .sk-fading-circle .sk-circle8 {\n  -webkit-transform: rotate(210deg);\n  -ms-transform: rotate(210deg);\n  transform: rotate(210deg);\n}\n#sk-holder .sk-fading-circle .sk-circle9 {\n  -webkit-transform: rotate(240deg);\n  -ms-transform: rotate(240deg);\n  transform: rotate(240deg);\n}\n#sk-holder .sk-fading-circle .sk-circle10 {\n  -webkit-transform: rotate(270deg);\n  -ms-transform: rotate(270deg);\n  transform: rotate(270deg);\n}\n#sk-holder .sk-fading-circle .sk-circle11 {\n  -webkit-transform: rotate(300deg);\n  -ms-transform: rotate(300deg);\n  transform: rotate(300deg);\n}\n#sk-holder .sk-fading-circle .sk-circle12 {\n  -webkit-transform: rotate(330deg);\n  -ms-transform: rotate(330deg);\n  transform: rotate(330deg);\n}\n#sk-holder .sk-fading-circle .sk-circle2:before {\n  -webkit-animation-delay: -1.1s;\n  animation-delay: -1.1s;\n}\n#sk-holder .sk-fading-circle .sk-circle3:before {\n  -webkit-animation-delay: -1s;\n  animation-delay: -1s;\n}\n#sk-holder .sk-fading-circle .sk-circle4:before {\n  -webkit-animation-delay: -0.9s;\n  animation-delay: -0.9s;\n}\n#sk-holder .sk-fading-circle .sk-circle5:before {\n  -webkit-animation-delay: -0.8s;\n  animation-delay: -0.8s;\n}\n#sk-holder .sk-fading-circle .sk-circle6:before {\n  -webkit-animation-delay: -0.7s;\n  animation-delay: -0.7s;\n}\n#sk-holder .sk-fading-circle .sk-circle7:before {\n  -webkit-animation-delay: -0.6s;\n  animation-delay: -0.6s;\n}\n#sk-holder .sk-fading-circle .sk-circle8:before {\n  -webkit-animation-delay: -0.5s;\n  animation-delay: -0.5s;\n}\n#sk-holder .sk-fading-circle .sk-circle9:before {\n  -webkit-animation-delay: -0.4s;\n  animation-delay: -0.4s;\n}\n#sk-holder .sk-fading-circle .sk-circle10:before {\n  -webkit-animation-delay: -0.3s;\n  animation-delay: -0.3s;\n}\n#sk-holder .sk-fading-circle .sk-circle11:before {\n  -webkit-animation-delay: -0.2s;\n  animation-delay: -0.2s;\n}\n#sk-holder .sk-fading-circle .sk-circle12:before {\n  -webkit-animation-delay: -0.1s;\n  animation-delay: -0.1s;\n}\n@-webkit-keyframes sk-circleFadeDelay {\n  0%,\n  39%,\n  100% {\n    opacity: 0;\n  }\n  40% {\n    opacity: 1;\n  }\n}\n@keyframes sk-circleFadeDelay {\n  0%,\n  39%,\n  100% {\n    opacity: 0;\n  }\n  40% {\n    opacity: 1;\n  }\n}\n#sk-holder .sk-appear {\n  bottom: 0;\n  -webkit-animation: sk-appear-frames-md 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n  animation: sk-appear-frames-md 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n  -webkit-animation-delay: .0s;\n  animation-delay: .0s;\n  -webkit-animation-fill-mode: forwards;\n  animation-fill-mode: forwards;\n}\n@media (min-width: 1200px) and (min-height: 648px) {\n  #sk-holder .sk-appear {\n    -webkit-animation: sk-appear-frames-lg 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n    animation: sk-appear-frames-lg 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n  }\n}\n@media (min-height: 488px) and (max-height: 648px) and (min-width: 768px) {\n  #sk-holder .sk-appear {\n    -webkit-animation: sk-appear-frames-md 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n    animation: sk-appear-frames-md 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n  }\n}\n@media (max-height: 488px) {\n  #sk-holder .sk-appear {\n    -webkit-animation: sk-appear-frames-sm 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n    animation: sk-appear-frames-sm 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n  }\n}\n@media (max-width: 768px) {\n  #sk-holder .sk-appear {\n    -webkit-animation: sk-appear-frames-fs 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n    animation: sk-appear-frames-fs 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n  }\n}\n#sk-holder .sk-appear #sk-handle {\n  -webkit-transform: rotate(270deg);\n  transform: rotate(270deg);\n  -webkit-animation: sk-rotate-frames 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n  animation: sk-rotate-frames 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n  -webkit-animation-delay: .0s;\n  animation-delay: .0s;\n  -webkit-animation-fill-mode: forwards;\n  animation-fill-mode: forwards;\n}\n@-webkit-keyframes sk-appear-frames-md {\n  0% {\n    bottom: -436px;\n  }\n  100% {\n    bottom: 0;\n  }\n}\n@keyframes sk-appear-frames-md {\n  0% {\n    bottom: -436px;\n  }\n  100% {\n    bottom: 0;\n  }\n}\n@-webkit-keyframes sk-appear-frames-lg {\n  0% {\n    bottom: -596px;\n  }\n  100% {\n    bottom: 0;\n  }\n}\n@keyframes sk-appear-frames-lg {\n  0% {\n    bottom: -596px;\n  }\n  100% {\n    bottom: 0;\n  }\n}\n@-webkit-keyframes sk-appear-frames-sm {\n  0% {\n    bottom: -189px;\n  }\n  100% {\n    bottom: 0;\n  }\n}\n@keyframes sk-appear-frames-sm {\n  0% {\n    bottom: -189px;\n  }\n  100% {\n    bottom: 0;\n  }\n}\n@-webkit-keyframes sk-appear-frames-fs {\n  0% {\n    bottom: calc(44px - 100%);\n  }\n  100% {\n    bottom: 0;\n  }\n}\n@keyframes sk-appear-frames-fs {\n  0% {\n    bottom: calc(44px - 100%);\n  }\n  100% {\n    bottom: 0;\n  }\n}\n#sk-holder .sk-close {\n  bottom: -436px;\n  -webkit-animation: sk-close-frames-md 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n  animation: sk-close-frames-md 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n  -webkit-animation-delay: .0s;\n  animation-delay: .0s;\n  -webkit-animation-fill-mode: forwards;\n  animation-fill-mode: forwards;\n}\n@media (min-width: 1200px) and (min-height: 648px) {\n  #sk-holder .sk-close {\n    bottom: -596px;\n    -webkit-animation: sk-close-frames-lg 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n    animation: sk-close-frames-lg 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n  }\n}\n@media (min-height: 488px) and (max-height: 648px) and (min-width: 768px) {\n  #sk-holder .sk-close {\n    bottom: -436px;\n    -webkit-animation: sk-close-frames-md 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n    animation: sk-close-frames-md 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n  }\n}\n@media (max-height: 488px) {\n  #sk-holder .sk-close {\n    bottom: -189px;\n    -webkit-animation: sk-close-frames-sm 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n    animation: sk-close-frames-sm 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n  }\n}\n@media (max-width: 768px) {\n  #sk-holder .sk-close {\n    bottom: calc(44px - 100%);\n    -webkit-animation: sk-close-frames-fs 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n    animation: sk-close-frames-fs 0.4s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n  }\n}\n@-webkit-keyframes sk-close-frames-md {\n  0% {\n    bottom: 0;\n  }\n  100% {\n    bottom: -436px;\n  }\n}\n@keyframes sk-close-frames-md {\n  0% {\n    bottom: 0;\n  }\n  100% {\n    bottom: -436px;\n  }\n}\n@-webkit-keyframes sk-close-frames-lg {\n  0% {\n    bottom: 0;\n  }\n  100% {\n    bottom: -596px;\n  }\n}\n@keyframes sk-close-frames-lg {\n  0% {\n    bottom: 0;\n  }\n  100% {\n    bottom: -596px;\n  }\n}\n@-webkit-keyframes sk-close-frames-sm {\n  0% {\n    bottom: 0;\n  }\n  100% {\n    bottom: -189px;\n  }\n}\n@keyframes sk-close-frames-sm {\n  0% {\n    bottom: 0;\n  }\n  100% {\n    bottom: -189px;\n  }\n}\n@-webkit-keyframes sk-close-frames-fs {\n  0% {\n    bottom: 0;\n  }\n  100% {\n    bottom: calc(44px - 100%);\n  }\n}\n@keyframes sk-close-frames-fs {\n  0% {\n    bottom: 0;\n  }\n  100% {\n    bottom: calc(44px - 100%);\n  }\n}\n#sk-holder .sk-noselect {\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  -webkit-touch-callout: none;\n  -khtml-user-select: none;\n}\n#sk-holder .sk-init {\n  bottom: -436px;\n}\n@media (min-width: 1200px) and (min-height: 648px) {\n  #sk-holder .sk-init {\n    bottom: -596px;\n  }\n}\n@media (min-height: 488px) and (max-height: 648px) and (min-width: 768px) {\n  #sk-holder .sk-init {\n    bottom: -436px;\n  }\n}\n@media (max-height: 488px) {\n  #sk-holder .sk-init {\n    bottom: -189px;\n  }\n}\n@media (max-width: 768px) {\n  #sk-holder .sk-init {\n    bottom: calc(44px - 100%);\n  }\n}\n#sk-holder html,\n#sk-holder body,\n#sk-holder div,\n#sk-holder span,\n#sk-holder applet,\n#sk-holder object,\n#sk-holder iframe,\n#sk-holder h1,\n#sk-holder h2,\n#sk-holder h3,\n#sk-holder h4,\n#sk-holder h5,\n#sk-holder h6,\n#sk-holder p,\n#sk-holder blockquote,\n#sk-holder pre,\n#sk-holder a,\n#sk-holder abbr,\n#sk-holder acronym,\n#sk-holder address,\n#sk-holder big,\n#sk-holder cite,\n#sk-holder code,\n#sk-holder del,\n#sk-holder dfn,\n#sk-holder em,\n#sk-holder img,\n#sk-holder ins,\n#sk-holder kbd,\n#sk-holder q,\n#sk-holder s,\n#sk-holder samp,\n#sk-holder small,\n#sk-holder strike,\n#sk-holder strong,\n#sk-holder sub,\n#sk-holder sup,\n#sk-holder tt,\n#sk-holder var,\n#sk-holder b,\n#sk-holder u,\n#sk-holder i,\n#sk-holder center,\n#sk-holder dl,\n#sk-holder dt,\n#sk-holder dd,\n#sk-holder ol,\n#sk-holder ul,\n#sk-holder li,\n#sk-holder fieldset,\n#sk-holder form,\n#sk-holder label,\n#sk-holder legend,\n#sk-holder table,\n#sk-holder caption,\n#sk-holder tbody,\n#sk-holder tfoot,\n#sk-holder thead,\n#sk-holder tr,\n#sk-holder th,\n#sk-holder td,\n#sk-holder article,\n#sk-holder aside,\n#sk-holder canvas,\n#sk-holder details,\n#sk-holder embed,\n#sk-holder figure,\n#sk-holder figcaption,\n#sk-holder footer,\n#sk-holder header,\n#sk-holder hgroup,\n#sk-holder menu,\n#sk-holder nav,\n#sk-holder output,\n#sk-holder ruby,\n#sk-holder section,\n#sk-holder summary,\n#sk-holder time,\n#sk-holder mark,\n#sk-holder audio,\n#sk-holder video {\n  border: 0;\n  font-size: 100%;\n  font: inherit;\n  vertical-align: baseline;\n  margin: 0;\n  padding: 0;\n}\n#sk-holder article,\n#sk-holder aside,\n#sk-holder details,\n#sk-holder figcaption,\n#sk-holder figure,\n#sk-holder footer,\n#sk-holder header,\n#sk-holder hgroup,\n#sk-holder menu,\n#sk-holder nav,\n#sk-holder section {\n  display: block;\n}\n#sk-holder body {\n  line-height: 1;\n}\n#sk-holder ol,\n#sk-holder ul {\n  list-style: none;\n}\n#sk-holder blockquote,\n#sk-holder q {\n  quotes: none;\n}\n#sk-holder blockquote:before,\n#sk-holder blockquote:after,\n#sk-holder q:before,\n#sk-holder q:after {\n  content: none;\n}\n#sk-holder table {\n  border-collapse: collapse;\n  border-spacing: 0;\n}\n#sk-holder #sk-container {\n  position: fixed;\n  right: 10px;\n  margin-bottom: -1px;\n  box-shadow: 0 0 24px rgba(0, 0, 0, 0.15);\n  border: 1px solid rgba(0, 0, 0, 0.15);\n  z-index: 9998;\n  overflow: hidden;\n  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;\n  font-weight: 400;\n  font-size: 13px;\n  line-height: 1.4;\n  border-radius: 10px 10px 0 0;\n  color: #333;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  -moz-font-smoothing: antialiased;\n  /*!\n *  Font Awesome custom set up\n */\n  /* FONT PATH\n * -------------------------- */\n}\n#sk-holder #sk-container div,\n#sk-holder #sk-container a,\n#sk-holder #sk-container form,\n#sk-holder #sk-container input,\n#sk-holder #sk-container label {\n  box-sizing: border-box;\n}\n@font-face {\n  font-family: 'FontAwesome';\n  src: url('//netdna.bootstrapcdn.com/font-awesome/4.5.0/fonts/fontawesome-webfont.eot?v=4.5.0');\n  src: url('//netdna.bootstrapcdn.com/font-awesome/4.5.0/fonts/fontawesome-webfont.eot?#iefix&v=4.5.0') format('embedded-opentype'), url('//netdna.bootstrapcdn.com/font-awesome/4.5.0/fonts/fontawesome-webfont.woff2?v=4.5.0') format('woff2'), url('//netdna.bootstrapcdn.com/font-awesome/4.5.0/fonts/fontawesome-webfont.woff?v=4.5.0') format('woff'), url('//netdna.bootstrapcdn.com/font-awesome/4.5.0/fonts/fontawesome-webfont.ttf?v=4.5.0') format('truetype'), url('//netdna.bootstrapcdn.com/font-awesome/4.5.0/fonts/fontawesome-webfont.svg?v=4.5.0#fontawesomeregular') format('svg');\n  font-weight: normal;\n  font-style: normal;\n}\n#sk-holder #sk-container .fa {\n  display: inline-block;\n  font: normal normal normal 14px/1 FontAwesome;\n  font-size: inherit;\n  text-rendering: auto;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n#sk-holder #sk-container .fa-envelope-o:before {\n  content: \"\\F003\";\n}\n#sk-holder #sk-container .fa-gear:before,\n#sk-holder #sk-container .fa-cog:before {\n  content: \"\\F013\";\n}\n#sk-holder #sk-container .fa-check:before {\n  content: \"\\F00C\";\n}\n#sk-holder #sk-container .fa-times:before {\n  content: \"\\F00D\";\n}\n#sk-holder #sk-container .fa-arrow-left:before {\n  content: \"\\F060\";\n}\n#sk-holder #sk-container .fa-camera:before {\n  content: \"\\F030\";\n}\n#sk-holder #sk-container .fa-arrow-up:before {\n  content: \"\\F062\";\n}\n#sk-holder #sk-container .fa-angle-right:before {\n  content: \"\\F105\";\n}\n#sk-holder #sk-container .fa-ellipsis-h:before {\n  content: \"\\F141\";\n}\n#sk-holder #sk-container .input-group {\n  padding: 5px 0;\n}\n#sk-holder #sk-container .input-group.has-error .input {\n  border-color: #e54054;\n}\n#sk-holder #sk-container .input {\n  background-color: #fbfbfb;\n  border: 1px solid #e8e8e8;\n  padding: 0 9px;\n  border-radius: 4px;\n  height: 33px;\n  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;\n  font-size: 13px;\n}\n#sk-holder #sk-container .input::-webkit-input-placeholder,\n#sk-holder #sk-container .input:-moz-placeholder,\n#sk-holder #sk-container .input::-moz-placeholder,\n#sk-holder #sk-container .input:-ms-input-placeholder {\n  color: #00aeff;\n  opacity: 1;\n}\n#sk-holder #sk-container .input:focus {\n  background-color: white;\n  color: #212121;\n  outline: 0;\n}\n#sk-holder #sk-container .btn {\n  display: inline-block;\n  margin-bottom: 0;\n  font-weight: normal;\n  text-align: center;\n  vertical-align: middle;\n  touch-action: manipulation;\n  cursor: pointer;\n  background-image: none;\n  border: 1px solid transparent;\n  white-space: nowrap;\n  padding: 6px 12px;\n  font-size: 14px;\n  line-height: 1.42857143;\n  border-radius: 4px;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n#sk-holder #sk-container .btn:focus,\n#sk-holder #sk-container .btn:active:focus,\n#sk-holder #sk-container .btn.active:focus,\n#sk-holder #sk-container .btn.focus,\n#sk-holder #sk-container .btn:active.focus,\n#sk-holder #sk-container .btn.active.focus {\n  outline: thin dotted;\n  outline: 5px auto -webkit-focus-ring-color;\n  outline-offset: -2px;\n}\n#sk-holder #sk-container .btn:hover,\n#sk-holder #sk-container .btn:focus,\n#sk-holder #sk-container .btn.focus {\n  color: #333;\n  outline: 0;\n  text-decoration: none;\n  opacity: 0.8;\n  filter: alpha(opacity=80);\n}\n#sk-holder #sk-container .btn:active,\n#sk-holder #sk-container .btn.active {\n  outline: 0;\n  background-image: none;\n  -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n  box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n}\n#sk-holder #sk-container .btn.disabled,\n#sk-holder #sk-container .btn[disabled],\nfieldset[disabled] #sk-holder #sk-container .btn {\n  cursor: not-allowed;\n  opacity: 0.65;\n  filter: alpha(opacity=65);\n  -webkit-box-shadow: none;\n  box-shadow: none;\n}\na#sk-holder #sk-container .btn.disabled,\nfieldset[disabled] a#sk-holder #sk-container .btn {\n  pointer-events: none;\n}\n#sk-holder #sk-container .btn-sk-primary {\n  color: white;\n  background-color: #00aeff;\n  border-color: #00aeff;\n}\n#sk-holder #sk-container .btn-sk-primary:focus,\n#sk-holder #sk-container .btn-sk-primary.focus {\n  color: white;\n  background-color: #008bcc;\n  border-color: #005780;\n}\n#sk-holder #sk-container .btn-sk-primary:hover {\n  color: white;\n  background-color: #008bcc;\n  border-color: #0084c2;\n}\n#sk-holder #sk-container .btn-sk-primary:active,\n#sk-holder #sk-container .btn-sk-primary.active,\n.open > .dropdown-toggle#sk-holder #sk-container .btn-sk-primary {\n  color: white;\n  background-color: #008bcc;\n  border-color: #0084c2;\n}\n#sk-holder #sk-container .btn-sk-primary:active:hover,\n#sk-holder #sk-container .btn-sk-primary.active:hover,\n.open > .dropdown-toggle#sk-holder #sk-container .btn-sk-primary:hover,\n#sk-holder #sk-container .btn-sk-primary:active:focus,\n#sk-holder #sk-container .btn-sk-primary.active:focus,\n.open > .dropdown-toggle#sk-holder #sk-container .btn-sk-primary:focus,\n#sk-holder #sk-container .btn-sk-primary:active.focus,\n#sk-holder #sk-container .btn-sk-primary.active.focus,\n.open > .dropdown-toggle#sk-holder #sk-container .btn-sk-primary.focus {\n  color: white;\n  background-color: #0073a8;\n  border-color: #005780;\n}\n#sk-holder #sk-container .btn-sk-primary:active,\n#sk-holder #sk-container .btn-sk-primary.active,\n.open > .dropdown-toggle#sk-holder #sk-container .btn-sk-primary {\n  background-image: none;\n}\n#sk-holder #sk-container .btn-sk-primary.disabled,\n#sk-holder #sk-container .btn-sk-primary[disabled],\nfieldset[disabled] #sk-holder #sk-container .btn-sk-primary,\n#sk-holder #sk-container .btn-sk-primary.disabled:hover,\n#sk-holder #sk-container .btn-sk-primary[disabled]:hover,\nfieldset[disabled] #sk-holder #sk-container .btn-sk-primary:hover,\n#sk-holder #sk-container .btn-sk-primary.disabled:focus,\n#sk-holder #sk-container .btn-sk-primary[disabled]:focus,\nfieldset[disabled] #sk-holder #sk-container .btn-sk-primary:focus,\n#sk-holder #sk-container .btn-sk-primary.disabled.focus,\n#sk-holder #sk-container .btn-sk-primary[disabled].focus,\nfieldset[disabled] #sk-holder #sk-container .btn-sk-primary.focus,\n#sk-holder #sk-container .btn-sk-primary.disabled:active,\n#sk-holder #sk-container .btn-sk-primary[disabled]:active,\nfieldset[disabled] #sk-holder #sk-container .btn-sk-primary:active,\n#sk-holder #sk-container .btn-sk-primary.disabled.active,\n#sk-holder #sk-container .btn-sk-primary[disabled].active,\nfieldset[disabled] #sk-holder #sk-container .btn-sk-primary.active {\n  background-color: #00aeff;\n  border-color: #00aeff;\n}\n#sk-holder #sk-container .btn-sk-primary .badge {\n  color: #00aeff;\n  background-color: white;\n}\n#sk-holder #sk-container .btn-sk-action-paid {\n  cursor: default;\n  color: #787f8c;\n  background-color: transparent;\n  border-color: #787f8c;\n}\n#sk-holder #sk-container .btn-sk-action-paid:focus,\n#sk-holder #sk-container .btn-sk-action-paid.focus {\n  color: #787f8c;\n  background-color: rgba(0, 0, 0, 0);\n  border-color: #3d4148;\n}\n#sk-holder #sk-container .btn-sk-action-paid:hover {\n  color: #787f8c;\n  background-color: rgba(0, 0, 0, 0);\n  border-color: #5b616b;\n}\n#sk-holder #sk-container .btn-sk-action-paid:active,\n#sk-holder #sk-container .btn-sk-action-paid.active,\n.open > .dropdown-toggle#sk-holder #sk-container .btn-sk-action-paid {\n  color: #787f8c;\n  background-color: rgba(0, 0, 0, 0);\n  border-color: #5b616b;\n}\n#sk-holder #sk-container .btn-sk-action-paid:active:hover,\n#sk-holder #sk-container .btn-sk-action-paid.active:hover,\n.open > .dropdown-toggle#sk-holder #sk-container .btn-sk-action-paid:hover,\n#sk-holder #sk-container .btn-sk-action-paid:active:focus,\n#sk-holder #sk-container .btn-sk-action-paid.active:focus,\n.open > .dropdown-toggle#sk-holder #sk-container .btn-sk-action-paid:focus,\n#sk-holder #sk-container .btn-sk-action-paid:active.focus,\n#sk-holder #sk-container .btn-sk-action-paid.active.focus,\n.open > .dropdown-toggle#sk-holder #sk-container .btn-sk-action-paid.focus {\n  color: #787f8c;\n  background-color: rgba(0, 0, 0, 0);\n  border-color: #3d4148;\n}\n#sk-holder #sk-container .btn-sk-action-paid:active,\n#sk-holder #sk-container .btn-sk-action-paid.active,\n.open > .dropdown-toggle#sk-holder #sk-container .btn-sk-action-paid {\n  background-image: none;\n}\n#sk-holder #sk-container .btn-sk-action-paid.disabled,\n#sk-holder #sk-container .btn-sk-action-paid[disabled],\nfieldset[disabled] #sk-holder #sk-container .btn-sk-action-paid,\n#sk-holder #sk-container .btn-sk-action-paid.disabled:hover,\n#sk-holder #sk-container .btn-sk-action-paid[disabled]:hover,\nfieldset[disabled] #sk-holder #sk-container .btn-sk-action-paid:hover,\n#sk-holder #sk-container .btn-sk-action-paid.disabled:focus,\n#sk-holder #sk-container .btn-sk-action-paid[disabled]:focus,\nfieldset[disabled] #sk-holder #sk-container .btn-sk-action-paid:focus,\n#sk-holder #sk-container .btn-sk-action-paid.disabled.focus,\n#sk-holder #sk-container .btn-sk-action-paid[disabled].focus,\nfieldset[disabled] #sk-holder #sk-container .btn-sk-action-paid.focus,\n#sk-holder #sk-container .btn-sk-action-paid.disabled:active,\n#sk-holder #sk-container .btn-sk-action-paid[disabled]:active,\nfieldset[disabled] #sk-holder #sk-container .btn-sk-action-paid:active,\n#sk-holder #sk-container .btn-sk-action-paid.disabled.active,\n#sk-holder #sk-container .btn-sk-action-paid[disabled].active,\nfieldset[disabled] #sk-holder #sk-container .btn-sk-action-paid.active {\n  background-color: transparent;\n  border-color: #787f8c;\n}\n#sk-holder #sk-container .btn-sk-action-paid .badge {\n  color: transparent;\n  background-color: #787f8c;\n}\n#sk-holder #sk-container .btn-sk-action-paid:active,\n#sk-holder #sk-container .btn-sk-action-paid:hover {\n  -webkit-box-shadow: none;\n  box-shadow: none;\n  border-color: #787f8c;\n}\n#sk-holder #sk-container .btn-sk-action-processing {\n  cursor: default;\n  color: white;\n  background-color: #00aeff;\n  border-color: #00aeff;\n}\n#sk-holder #sk-container .btn-sk-action-processing:focus,\n#sk-holder #sk-container .btn-sk-action-processing.focus {\n  color: white;\n  background-color: #008bcc;\n  border-color: #005780;\n}\n#sk-holder #sk-container .btn-sk-action-processing:hover {\n  color: white;\n  background-color: #008bcc;\n  border-color: #0084c2;\n}\n#sk-holder #sk-container .btn-sk-action-processing:active,\n#sk-holder #sk-container .btn-sk-action-processing.active,\n.open > .dropdown-toggle#sk-holder #sk-container .btn-sk-action-processing {\n  color: white;\n  background-color: #008bcc;\n  border-color: #0084c2;\n}\n#sk-holder #sk-container .btn-sk-action-processing:active:hover,\n#sk-holder #sk-container .btn-sk-action-processing.active:hover,\n.open > .dropdown-toggle#sk-holder #sk-container .btn-sk-action-processing:hover,\n#sk-holder #sk-container .btn-sk-action-processing:active:focus,\n#sk-holder #sk-container .btn-sk-action-processing.active:focus,\n.open > .dropdown-toggle#sk-holder #sk-container .btn-sk-action-processing:focus,\n#sk-holder #sk-container .btn-sk-action-processing:active.focus,\n#sk-holder #sk-container .btn-sk-action-processing.active.focus,\n.open > .dropdown-toggle#sk-holder #sk-container .btn-sk-action-processing.focus {\n  color: white;\n  background-color: #0073a8;\n  border-color: #005780;\n}\n#sk-holder #sk-container .btn-sk-action-processing:active,\n#sk-holder #sk-container .btn-sk-action-processing.active,\n.open > .dropdown-toggle#sk-holder #sk-container .btn-sk-action-processing {\n  background-image: none;\n}\n#sk-holder #sk-container .btn-sk-action-processing.disabled,\n#sk-holder #sk-container .btn-sk-action-processing[disabled],\nfieldset[disabled] #sk-holder #sk-container .btn-sk-action-processing,\n#sk-holder #sk-container .btn-sk-action-processing.disabled:hover,\n#sk-holder #sk-container .btn-sk-action-processing[disabled]:hover,\nfieldset[disabled] #sk-holder #sk-container .btn-sk-action-processing:hover,\n#sk-holder #sk-container .btn-sk-action-processing.disabled:focus,\n#sk-holder #sk-container .btn-sk-action-processing[disabled]:focus,\nfieldset[disabled] #sk-holder #sk-container .btn-sk-action-processing:focus,\n#sk-holder #sk-container .btn-sk-action-processing.disabled.focus,\n#sk-holder #sk-container .btn-sk-action-processing[disabled].focus,\nfieldset[disabled] #sk-holder #sk-container .btn-sk-action-processing.focus,\n#sk-holder #sk-container .btn-sk-action-processing.disabled:active,\n#sk-holder #sk-container .btn-sk-action-processing[disabled]:active,\nfieldset[disabled] #sk-holder #sk-container .btn-sk-action-processing:active,\n#sk-holder #sk-container .btn-sk-action-processing.disabled.active,\n#sk-holder #sk-container .btn-sk-action-processing[disabled].active,\nfieldset[disabled] #sk-holder #sk-container .btn-sk-action-processing.active {\n  background-color: #00aeff;\n  border-color: #00aeff;\n}\n#sk-holder #sk-container .btn-sk-action-processing .badge {\n  color: #00aeff;\n  background-color: white;\n}\n#sk-holder #sk-container .btn-sk-action-processing:active,\n#sk-holder #sk-container .btn-sk-action-processing:hover,\n#sk-holder #sk-container .btn-sk-action-processing:active:hover {\n  -webkit-box-shadow: none;\n  box-shadow: none;\n  background-color: #00aeff;\n  border-color: #00aeff;\n}\n#sk-holder #sk-container a.btn {\n  text-decoration: none;\n}\n#sk-holder #sk-container .btn-sk-link {\n  color: #337ab7;\n  font-weight: normal;\n  border-radius: 0;\n}\n#sk-holder #sk-container .btn-sk-link,\n#sk-holder #sk-container .btn-sk-link:active,\n#sk-holder #sk-container .btn-sk-link.active,\n#sk-holder #sk-container .btn-sk-link[disabled],\nfieldset[disabled] #sk-holder #sk-container .btn-sk-link {\n  background-color: transparent;\n  -webkit-box-shadow: none;\n  box-shadow: none;\n}\n#sk-holder #sk-container .btn-sk-link,\n#sk-holder #sk-container .btn-sk-link:hover,\n#sk-holder #sk-container .btn-sk-link:focus,\n#sk-holder #sk-container .btn-sk-link:active {\n  border-color: transparent;\n}\n#sk-holder #sk-container .btn-sk-link:hover,\n#sk-holder #sk-container .btn-sk-link:focus {\n  color: #23527c;\n  text-decoration: underline;\n  background-color: transparent;\n}\n#sk-holder #sk-container .btn-sk-link[disabled]:hover,\nfieldset[disabled] #sk-holder #sk-container .btn-sk-link:hover,\n#sk-holder #sk-container .btn-sk-link[disabled]:focus,\nfieldset[disabled] #sk-holder #sk-container .btn-sk-link:focus {\n  color: #777777;\n  text-decoration: none;\n}\n#sk-holder #sk-container #sk-header {\n  z-index: 10;\n  height: 32px;\n  line-height: 28px;\n  padding: 6px 18px;\n  position: relative;\n  background-color: #f4f4f4;\n  cursor: pointer;\n  border-radius: 8px 8px 0 0;\n  font-size: 16px;\n  font-weight: 400;\n  box-sizing: content-box;\n  border-bottom: 1px solid #eee;\n  text-align: center;\n}\n#sk-holder #sk-container #sk-header .fa {\n  line-height: 28px;\n  color: #808080;\n  font-size: 15px;\n}\n#sk-holder #sk-container #sk-header .sk-close-handle,\n#sk-holder #sk-container #sk-header .sk-show-handle {\n  cursor: pointer;\n  position: absolute;\n  top: 6px;\n  right: 10px;\n}\n@media (min-width: 768px) {\n  #sk-holder #sk-container #sk-header .sk-show-handle {\n    display: none;\n  }\n}\n#sk-holder #sk-container #sk-header .sk-back-handle {\n  cursor: pointer;\n  display: inline-block;\n  margin-right: 8px;\n  height: 30px;\n}\n#sk-holder #sk-container #sk-header .sk-close-handle .fa {\n  font-size: 17px;\n}\n#sk-holder #sk-container #sk-header .settings-content {\n  display: inline-block;\n  height: 44px;\n  margin-top: -6px;\n  margin-left: -18px;\n}\n#sk-holder #sk-container #sk-header .settings-content > div {\n  margin-top: 6px;\n  margin-left: 18px;\n}\n#sk-holder #sk-container #sk-badge {\n  background-color: #e54054;\n  border-radius: 100px;\n  box-shadow: 0 0 0 1px #cf2615;\n  color: white;\n  position: absolute;\n  top: 11px;\n  left: 10px;\n  padding: 0 6px;\n  font-size: 12px;\n  font-weight: 400;\n  line-height: 18px;\n}\n#sk-holder #sk-container #sk-settings-handle {\n  cursor: pointer;\n  position: absolute;\n  top: 7px;\n  right: 27px;\n  width: 25px;\n  display: none;\n}\n#sk-holder #sk-container.sk-appear #sk-settings-handle {\n  display: block;\n}\n#sk-holder #sk-container #sk-settings-header {\n  z-index: 10;\n  height: 32px;\n  line-height: 28px;\n  padding: 6px 18px;\n  position: relative;\n  background-color: #f4f4f4;\n  cursor: pointer;\n  border-radius: 8px 8px 0 0;\n  font-size: 16px;\n  font-weight: 400;\n  box-sizing: content-box;\n  border-bottom: 1px solid #eee;\n}\n#sk-holder #sk-container #sk-settings-header .fa {\n  line-height: 28px;\n  color: #808080;\n  font-size: 15px;\n}\n#sk-holder #sk-container #sk-settings-header .sk-close-handle,\n#sk-holder #sk-container #sk-settings-header .sk-show-handle {\n  cursor: pointer;\n  position: absolute;\n  top: 6px;\n  right: 10px;\n}\n@media (min-width: 768px) {\n  #sk-holder #sk-container #sk-settings-header .sk-show-handle {\n    display: none;\n  }\n}\n#sk-holder #sk-container #sk-settings-header .sk-back-handle {\n  cursor: pointer;\n  display: inline-block;\n  margin-right: 8px;\n  height: 30px;\n}\n#sk-holder #sk-container #sk-settings-header .sk-close-handle .fa {\n  font-size: 17px;\n}\n#sk-holder #sk-container #sk-settings-header .settings-content {\n  display: inline-block;\n  height: 44px;\n  margin-top: -6px;\n  margin-left: -18px;\n}\n#sk-holder #sk-container #sk-settings-header .settings-content > div {\n  margin-top: 6px;\n  margin-left: 18px;\n}\n#sk-holder #sk-container .sk-notification-container {\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);\n  position: absolute;\n  width: 100%;\n  z-index: 1;\n}\n#sk-holder #sk-container .sk-notification-container .sk-notification {\n  overflow: hidden;\n  height: 56px;\n  width: 100%;\n  border-top: 1px solid rgba(0, 0, 0, 0.1);\n  background-color: white;\n}\n#sk-holder #sk-container .sk-notification-container .sk-notification.long-text {\n  height: 75px;\n}\n#sk-holder #sk-container .sk-notification-container .sk-notification p {\n  margin: 18px 18px;\n}\n#sk-holder #sk-container .sk-notification-container .sk-notification p a {\n  color: #00aeff;\n}\n#sk-holder #sk-container .sk-notification-container .sk-notification p .sk-notification-close {\n  font-size: 20px;\n  font-weight: 600;\n  position: absolute;\n  top: 0;\n  right: 10px;\n  display: block;\n  width: 22px;\n  height: 32px;\n  padding-left: 10px;\n  text-decoration: none;\n  color: #808080;\n}\n#sk-holder #sk-container .sk-notification-container .sk-notification.sk-notification-error {\n  background-color: #e54054;\n  color: white;\n}\n#sk-holder #sk-container .sk-notification-container .sk-notification.sk-notification-error .sk-notification-close {\n  color: white;\n}\n#sk-holder #sk-container .sk-notification-container .sk-notification-enter {\n  height: 0;\n}\n#sk-holder #sk-container .sk-notification-container .sk-notification-enter-active {\n  -webkit-transition: height 500ms;\n  -o-transition: height 500ms;\n  transition: height 500ms;\n  height: 56px;\n}\n#sk-holder #sk-container .sk-notification-container .sk-notification-leave {\n  height: 56px;\n}\n#sk-holder #sk-container .sk-notification-container .sk-notification-leave-active {\n  -webkit-transition: height 500ms;\n  -o-transition: height 500ms;\n  transition: height 500ms;\n  height: 0;\n}\n#sk-holder #sk-container #sk-conversation {\n  position: relative;\n  padding: 0;\n  height: calc(100% - 89px);\n  overflow-y: scroll;\n  overflow-x: hidden;\n  -webkit-overflow-scrolling: touch;\n  -webkit-transition: padding-top 500ms;\n  -o-transition: padding-top 500ms;\n  transition: padding-top 500ms;\n}\n@media (max-width: 768px) {\n  #sk-holder #sk-container #sk-conversation {\n    height: calc(100%  - 89px);\n  }\n}\n#sk-holder #sk-container #sk-conversation.notification-shown {\n  padding-top: 56px;\n}\n#sk-holder #sk-container #sk-conversation .sk-intro-section {\n  background-color: #F8F9FA;\n  padding: 18px 18px 22px 18px;\n  border-bottom: solid 1px #E6E6E6;\n}\n#sk-holder #sk-container #sk-conversation .sk-intro-section .app-name {\n  color: #464646;\n  font-size: 18px;\n  font-weight: bold;\n}\n#sk-holder #sk-container #sk-conversation .sk-intro-section .intro-text {\n  color: #787f8c;\n  font-size: 13px;\n  line-height: 1.3;\n  margin-top: 8px;\n}\n#sk-holder #sk-container #sk-conversation .sk-intro-section .app-icon {\n  float: left;\n  width: 50px;\n  height: 50px;\n  border-radius: 50%;\n}\n#sk-holder #sk-container #sk-conversation .sk-intro-section .app-name,\n#sk-holder #sk-container #sk-conversation .sk-intro-section .intro-text {\n  margin-left: 68px;\n}\n#sk-holder #sk-container #sk-conversation .sk-intro-section .available-channels {\n  margin-top: 22px;\n  text-align: center;\n  color: #787f8c;\n}\n#sk-holder #sk-container #sk-conversation .sk-intro-section .available-channels .channel-icon {\n  cursor: pointer;\n  margin-right: 13px;\n}\n#sk-holder #sk-container #sk-conversation .sk-intro-section .available-channels .channel-icon:last-child {\n  margin-right: 0;\n}\n#sk-holder #sk-container #sk-conversation .sk-messages-container {\n  position: absolute;\n  bottom: 0;\n  width: 100%;\n  max-height: 100%;\n}\n#sk-holder #sk-container #sk-conversation .sk-messages {\n  padding: 0 15px 0 5px;\n}\n#sk-holder #sk-container #sk-conversation .sk-row {\n  clear: both;\n  padding-bottom: 0px;\n  padding-top: 2px;\n}\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper {\n  max-width: 100%;\n  position: relative;\n}\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg,\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg-image {\n  font-size: 14px;\n  line-height: 1.25;\n  position: relative;\n  border-radius: 14px;\n  border-left-color: #00aeff;\n  margin-bottom: 10px;\n}\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg.sk-msg-appmaker-first,\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg-image.sk-msg-appmaker-first {\n  border-bottom-left-radius: 2px;\n  margin-bottom: 0px;\n}\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg.sk-msg-appmaker-middle,\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg-image.sk-msg-appmaker-middle {\n  border-bottom-left-radius: 2px;\n  border-top-left-radius: 2px;\n  margin-bottom: 0px;\n}\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg.sk-msg-appmaker-last,\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg-image.sk-msg-appmaker-last {\n  border-top-left-radius: 2px;\n  margin-bottom: 3px;\n}\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg.sk-msg-appuser-first,\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg-image.sk-msg-appuser-first {\n  border-bottom-right-radius: 2px;\n  margin-bottom: 0px;\n}\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg.sk-msg-appuser-middle,\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg-image.sk-msg-appuser-middle {\n  border-bottom-right-radius: 2px;\n  border-top-right-radius: 2px;\n  margin-bottom: 0px;\n}\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg.sk-msg-appuser-last,\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg-image.sk-msg-appuser-last {\n  border-top-right-radius: 2px;\n}\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg .imageloader,\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg-image .imageloader {\n  display: block;\n  border-radius: inherit;\n  overflow: hidden;\n}\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg .preloader-container,\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg-image .preloader-container {\n  min-width: 150px;\n  min-height: 100px;\n}\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg .preloader-container img,\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg-image .preloader-container img {\n  max-width: 100%;\n}\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg .image-container,\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg-image .image-container {\n  position: relative;\n  border-radius: inherit;\n}\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg .image-overlay,\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg-image .image-overlay {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(255, 255, 255, 0.5);\n}\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg .spinner,\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg-image .spinner {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg img,\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg-image img {\n  max-width: 100%;\n}\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg .three-bounce .bounce1,\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg-image .three-bounce .bounce1,\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg .three-bounce .bounce2,\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg-image .three-bounce .bounce2,\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg .three-bounce .bounce3,\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg-image .three-bounce .bounce3 {\n  height: 15px;\n  width: 15px;\n  background-color: #00aeff;\n}\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg {\n  padding: 8px 13px 9px;\n  line-height: 1.3;\n  word-break: break-word;\n  word-wrap: break-word;\n  -webkit-hyphens: auto;\n  -moz-hyphens: auto;\n  -ms-hyphens: auto;\n  -o-hyphens: auto;\n  hyphens: auto;\n}\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg .has-actions {\n  margin-bottom: 5px;\n  display: inline-block;\n}\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-msg a.link {\n  text-decoration: underline;\n}\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-action {\n  margin-bottom: 5px;\n}\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-action .btn {\n  white-space: inherit;\n  -webkit-transition: 'width' 100ms;\n  -o-transition: 'width' 100ms;\n  transition: 'width' 100ms;\n}\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-action:last-child {\n  margin-bottom: 0px;\n}\n#sk-holder #sk-container #sk-conversation .sk-row .sk-msg-wrapper .sk-action a.btn {\n  display: block;\n  border-radius: 7px;\n  margin-right: 8px;\n  margin-left: 8px;\n}\n#sk-holder #sk-container #sk-conversation .sk-row.sk-left-row .sk-msg-wrapper {\n  display: inline-block;\n}\n#sk-holder #sk-container #sk-conversation .sk-row.sk-left-row .sk-msg-wrapper .sk-msg,\n#sk-holder #sk-container #sk-conversation .sk-row.sk-left-row .sk-msg-wrapper .sk-msg-image {\n  background-color: #f4f4f4;\n  color: #424242;\n  max-width: 200px;\n}\n#sk-holder #sk-container #sk-conversation .sk-row.sk-left-row .sk-msg-wrapper .sk-msg:after,\n#sk-holder #sk-container #sk-conversation .sk-row.sk-left-row .sk-msg-wrapper .sk-msg-image:after {\n  right: 100%;\n  border-color: rgba(236, 236, 236, 0);\n  border-right-color: white;\n}\n#sk-holder #sk-container #sk-conversation .sk-row.sk-left-row .sk-msg-wrapper .sk-msg a.link,\n#sk-holder #sk-container #sk-conversation .sk-row.sk-left-row .sk-msg-wrapper .sk-msg-image a.link,\n#sk-holder #sk-container #sk-conversation .sk-row.sk-left-row .sk-msg-wrapper .sk-msg a.link:visited,\n#sk-holder #sk-container #sk-conversation .sk-row.sk-left-row .sk-msg-wrapper .sk-msg-image a.link:visited {\n  color: #00aeff;\n}\n#sk-holder #sk-container #sk-conversation .sk-row.sk-left-row .sk-msg-avatar {\n  width: 31px;\n  border-radius: 50%;\n  margin-right: 5px;\n  margin-bottom: -11px;\n  display: inline-block;\n  margin-left: 9px;\n}\n#sk-holder #sk-container #sk-conversation .sk-row.sk-left-row .sk-msg-avatar.sk-msg-avatar-img {\n  margin-bottom: 0px;\n}\n#sk-holder #sk-container #sk-conversation .sk-row.sk-left-row .sk-msg-avatar-placeholder {\n  width: 35px;\n  display: inline-block;\n  margin-right: 10px;\n}\n#sk-holder #sk-container #sk-conversation .sk-row.sk-right-row .sk-msg,\n#sk-holder #sk-container #sk-conversation .sk-row.sk-right-row .sk-msg-image {\n  background-color: #00aeff;\n  float: right;\n  color: white;\n  max-width: 204px;\n}\n#sk-holder #sk-container #sk-conversation .sk-row.sk-right-row .sk-msg:after,\n#sk-holder #sk-container #sk-conversation .sk-row.sk-right-row .sk-msg-image:after {\n  left: 100%;\n  border-color: rgba(0, 174, 255, 0);\n  border-left-color: inherit;\n}\n#sk-holder #sk-container #sk-conversation .sk-row.sk-right-row .sk-msg a.link,\n#sk-holder #sk-container #sk-conversation .sk-row.sk-right-row .sk-msg-image a.link,\n#sk-holder #sk-container #sk-conversation .sk-row.sk-right-row .sk-msg a.link:visited,\n#sk-holder #sk-container #sk-conversation .sk-row.sk-right-row .sk-msg-image a.link:visited {\n  color: white;\n}\n#sk-holder #sk-container #sk-conversation .sk-row.sk-right-row .sk-msg-image {\n  background-color: transparent;\n}\n#sk-holder #sk-container #sk-conversation .sk-row:last-child {\n  padding-bottom: 10px;\n}\n#sk-holder #sk-container #sk-conversation .sk-clear {\n  clear: both;\n}\n#sk-holder #sk-container #sk-conversation::-webkit-scrollbar-track {\n  border-radius: 10px;\n  box-shadow: inset 0 -6px 0 0 #fff, inset 0 6px 0 0 #fff;\n  background-color: #f4f4f4;\n}\n#sk-holder #sk-container #sk-conversation::-webkit-scrollbar {\n  width: 8px;\n  background-color: #fff;\n}\n#sk-holder #sk-container #sk-conversation::-webkit-scrollbar-thumb {\n  border-radius: 10px;\n  box-shadow: inset 0 -6px 0 0 #fff, inset 0 6px 0 0 #fff;\n  background-color: rgba(210, 210, 210, 0.97);\n}\n#sk-holder #sk-container #sk-conversation .sk-logo {\n  margin-bottom: 10px;\n  margin-left: calc(50% - 83px);\n}\n#sk-holder #sk-container #sk-conversation .sk-logo a {\n  font-size: 12px;\n  color: #bbb;\n  text-decoration: none;\n}\n#sk-holder #sk-container #sk-conversation .sk-logo .sk-image {\n  position: relative;\n  left: 2px;\n  top: 3px;\n  width: 87px;\n  vertical-align: baseline;\n}\n#sk-holder #sk-container #sk-conversation .sk-from {\n  white-space: nowrap;\n  top: -20px;\n  font-size: 12px;\n  color: #787f8c;\n  padding-left: 12px;\n  margin-bottom: 2px;\n  margin-left: 45px;\n}\n#sk-holder #sk-container #sk-conversation .connect-notification {\n  padding: 21px 42px;\n  line-height: 1.3;\n  font-size: 14px;\n  text-align: center;\n}\n#sk-holder #sk-container #sk-conversation .connect-notification p {\n  color: #b2b2b2;\n}\n#sk-holder #sk-container #sk-conversation .connect-notification .connect-notification-channels {\n  padding-top: 5px;\n}\n#sk-holder #sk-container #sk-conversation .connect-notification .connect-notification-channels .channel-details {\n  padding-left: 5px;\n  padding-right: 5px;\n  display: inline-block;\n}\n#sk-holder #sk-container #sk-conversation .connect-notification .connect-notification-channels .channel-details .channel-link {\n  color: #00aeff;\n  display: inline-block;\n}\n#sk-holder #sk-container #sk-footer {\n  position: relative;\n  width: 100%;\n  height: 45px;\n  bottom: 0;\n  left: 0;\n  border: none;\n  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.1);\n  background-color: white;\n  z-index: 1;\n}\n#sk-holder #sk-container #sk-footer .image-upload {\n  height: 45px;\n  width: 35px;\n  color: #b2b2b2;\n  display: inline-block;\n  padding: 15px 10px;\n  font-size: 14px;\n  line-height: 14px;\n}\n#sk-holder #sk-container #sk-footer .image-upload:hover {\n  color: #00aeff;\n}\n#sk-holder #sk-container #sk-footer .image-upload input[type=\"file\"] {\n  position: fixed;\n  top: -1000px;\n}\n#sk-holder #sk-container #sk-footer form {\n  display: inline-block;\n}\n#sk-holder #sk-container #sk-footer .input-container {\n  width: 100%;\n  padding: 5px 0;\n  display: inline-block;\n}\n#sk-holder #sk-container #sk-footer .input-container.no-upload {\n  padding: 5px 0 5px 9px;\n}\n#sk-holder #sk-container #sk-footer .input-container .message-input {\n  width: 100%;\n  -webkit-appearance: none;\n}\n#sk-holder #sk-container #sk-footer .input-container .message-input::-ms-clear {\n  display: none;\n}\n#sk-holder #sk-container #sk-footer .input-container .message-input:-ms-input-placeholder {\n  color: #b2b2b2;\n}\n#sk-holder #sk-container #sk-footer .send {\n  margin-top: 1px;\n  color: #b2b2b2;\n  font-weight: 600;\n  position: relative;\n  height: 45px;\n  line-height: 42px;\n  text-decoration: none;\n  padding: 0 10px;\n  cursor: pointer;\n  display: inline-block;\n}\n#sk-holder #sk-container #sk-footer .send.active {\n  color: #00aeff;\n}\n#sk-holder #sk-container #sk-footer .send.active:hover {\n  opacity: 0.8;\n  filter: alpha(opacity=80);\n}\n#sk-holder #sk-container .sk-settings {\n  box-sizing: border-box;\n  border-top: 1px solid rgba(0, 0, 0, 0.1);\n  position: absolute;\n  z-index: 2;\n  background-color: white;\n  overflow: hidden;\n  opacity: 1;\n  font-size: 12px;\n  color: #787f8c;\n  width: 100%;\n  height: 100%;\n}\n#sk-holder #sk-container .sk-settings .settings-wrapper {\n  padding: 30px 40px;\n  box-sizing: border-box;\n}\n#sk-holder #sk-container .sk-settings .settings-wrapper .input-group {\n  position: relative;\n}\n#sk-holder #sk-container .sk-settings .settings-wrapper .input-group i.before-icon {\n  color: #bdbdbd;\n  position: absolute;\n  top: 16px;\n  left: 11px;\n}\n#sk-holder #sk-container .sk-settings .settings-wrapper .input-group .email-input {\n  box-sizing: border-box;\n  padding: 0 9px 0 30px;\n  width: 100%;\n}\n#sk-holder #sk-container .sk-settings .settings-wrapper .input-group .form-message {\n  padding: 6px 12px;\n  font-size: 14px;\n  line-height: 1.42857143;\n  border-radius: 4px;\n  vertical-align: middle;\n}\n#sk-holder #sk-container .sk-settings .settings-wrapper .input-group .form-message i.success {\n  color: #5cb85c;\n}\n#sk-holder #sk-container .sk-settings .settings-wrapper .settings-header {\n  font-weight: 700;\n  font-size: 15px;\n  color: #464646;\n  margin-bottom: 15px;\n}\n#sk-holder #sk-container .sk-settings .settings-wrapper .settings-description {\n  font-size: 13px;\n}\n#sk-holder #sk-container .sk-settings.settings-enter {\n  width: 0;\n}\n#sk-holder #sk-container .sk-settings.settings-enter-active {\n  -webkit-transition: width 250ms;\n  -o-transition: width 250ms;\n  transition: width 250ms;\n  width: 100%;\n}\n#sk-holder #sk-container .sk-settings.settings-leave {\n  width: 100%;\n}\n#sk-holder #sk-container .sk-settings.settings-leave-active {\n  -webkit-transition: width 250ms;\n  -o-transition: width 250ms;\n  transition: width 250ms;\n  width: 0;\n}\n#sk-holder #sk-container .sk-settings .channels {\n  margin-top: 30px;\n}\n#sk-holder #sk-container .sk-settings .channels .channel-item {\n  cursor: pointer;\n}\n#sk-holder #sk-container .sk-settings .channels .channel-item.channel-item-linked .channel-item-right {\n  color: #00aeff;\n  text-decoration: underline;\n}\n#sk-holder #sk-container .sk-settings .channels .channel-item:first-child .channel-item-name {\n  border-top: 1px solid #EFEFEF;\n}\n#sk-holder #sk-container .sk-settings .channels .channel-item .channel-item-header {\n  position: relative;\n}\n#sk-holder #sk-container .sk-settings .channels .channel-item .channel-item-header .channel-item-icon {\n  width: 26px;\n  position: absolute;\n  display: inline-block;\n  vertical-align: middle;\n  top: 9px;\n}\n#sk-holder #sk-container .sk-settings .channels .channel-item .channel-item-header .channel-item-content {\n  display: inline-block;\n  margin-left: 38px;\n  border-bottom: 1px solid #EFEFEF;\n  width: calc(100% - 26px - 12px);\n}\n#sk-holder #sk-container .sk-settings .channels .channel-item .channel-item-header .channel-item-content .channel-item-name {\n  font-size: 13px;\n  color: #464646;\n  line-height: 43px;\n}\n#sk-holder #sk-container .sk-settings .channels .channel-item .channel-item-header .channel-item-content .channel-item-connected-as {\n  margin-bottom: 10px;\n  margin-top: -10px;\n  font-size: 10px;\n}\n#sk-holder #sk-container .sk-settings .channels .channel-item .channel-item-header .channel-item-right {\n  position: absolute;\n  right: 0;\n  height: 45px;\n  line-height: 45px;\n  display: inline-block;\n}\n#sk-holder #sk-container .sk-settings .channels .channel-item .channel-item-header .channel-item-right i.fa {\n  font: normal normal normal 12px/45px FontAwesome;\n  color: #787f8c;\n  font-size: 13px;\n}\n#sk-holder #sk-container .sk-channel {\n  box-sizing: border-box;\n  border-top: 1px solid rgba(0, 0, 0, 0.1);\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  z-index: 3;\n  background-color: white;\n  overflow: hidden;\n  opacity: 1;\n  text-align: center;\n  line-height: 1.5;\n  font-size: 14px;\n}\n#sk-holder #sk-container .sk-channel.sk-channel-visible {\n  -webkit-transition: width 250ms;\n  -o-transition: width 250ms;\n  transition: width 250ms;\n  width: 100%;\n}\n#sk-holder #sk-container .sk-channel.sk-channel-hidden {\n  -webkit-transition: width 250ms;\n  -o-transition: width 250ms;\n  transition: width 250ms;\n  width: 0;\n}\n#sk-holder #sk-container .sk-channel .content-wrapper {\n  padding: 40px 40px;\n}\n#sk-holder #sk-container .sk-channel .channel-header .channel-icon {\n  margin-bottom: 40px;\n  height: 65px;\n}\n#sk-holder #sk-container .sk-channel .channel-header .channel-name {\n  font-size: 18px;\n  color: #464646;\n  font-weight: 600;\n  margin-bottom: 10px;\n}\n#sk-holder #sk-container .sk-channel .channel-header .channel-description {\n  margin-bottom: 20px;\n  color: #787f8c;\n}\n#sk-holder #sk-container .sk-channel .channel-content {\n  overflow: hidden;\n}\n#sk-holder #sk-container .sk-channel .channel-content a,\n#sk-holder #sk-container .sk-channel .channel-content a:visited {\n  color: #00aeff;\n}\n#sk-holder #sk-container .sk-channel .channel-content a.sk-error-link,\n#sk-holder #sk-container .sk-channel .channel-content a:visited.sk-error-link {\n  color: #e54054;\n  cursor: pointer;\n}\n#sk-holder #sk-container .sk-channel .channel-content .channel-content-value {\n  font-weight: 600;\n  color: #464646;\n}\n#sk-holder #sk-container .sk-channel .sk-fb-button-wrapper {\n  text-align: left;\n}\n#sk-holder #sk-container .sk-channel .fb-send-to-messenger {\n  margin-left: 54px;\n}\n@media (max-width: 330px) {\n  #sk-holder #sk-container .sk-channel .fb-send-to-messenger {\n    margin-left: 0;\n  }\n}\n@media (min-width: 1200px) {\n  #sk-holder #sk-container .sk-channel .fb-send-to-messenger {\n    margin-left: 90px;\n  }\n}\n#sk-holder #sk-container.sk-appear .sk-appear-hidden {\n  display: none;\n}\n#sk-holder #sk-container.sk-appear .sk-appear-visible {\n  display: block;\n}\n#sk-holder #sk-container.sk-close .sk-close-hidden {\n  display: none;\n}\n#sk-holder #sk-container.sk-close .sk-close-visible {\n  display: block;\n}\n#sk-holder #sk-container #sk-wrapper {\n  background: #fff;\n  width: 350px;\n  height: 480px;\n  position: relative;\n  border-radius: 10px 10px 0 0;\n}\n@media (min-height: 648px) and (min-width: 1200px) {\n  #sk-holder #sk-container #sk-wrapper {\n    width: 410px;\n    height: 640px;\n  }\n}\n@media (max-height: 648px) and (min-height: 488px) {\n  #sk-holder #sk-container #sk-wrapper {\n    width: 350px;\n    height: 480px;\n  }\n}\n@media (max-height: 488px) {\n  #sk-holder #sk-container #sk-wrapper {\n    width: 100%;\n    height: 100%;\n  }\n}\n@media (max-width: 768px) {\n  #sk-holder #sk-container {\n    right: 0;\n    border-radius: 0;\n    width: 100%;\n    border: none;\n    height: 100%;\n    max-height: 100%;\n  }\n  #sk-holder #sk-container.sk-appear,\n  #sk-holder #sk-container.sk-appear #sk-wrapper {\n    height: 100%;\n    max-height: 100%;\n  }\n  #sk-holder #sk-container #sk-wrapper {\n    width: 100%;\n    max-width: 100%;\n  }\n}\n#sk-holder #sk-container .input {\n  background-color: white;\n  border: 1px solid white;\n  padding: 0px;\n}\n#sk-holder #sk-container .content-wrapper {\n  overflow-y: auto;\n  width: 350px;\n  height: calc(480px - 44px);\n}\n#sk-holder #sk-container .content-wrapper::-webkit-scrollbar-track {\n  border-radius: 10px;\n  box-shadow: inset 0 -6px 0 0 #fff, inset 0 6px 0 0 #fff;\n  background-color: #f4f4f4;\n}\n#sk-holder #sk-container .content-wrapper::-webkit-scrollbar {\n  width: 8px;\n  background-color: #fff;\n}\n#sk-holder #sk-container .content-wrapper::-webkit-scrollbar-thumb {\n  border-radius: 10px;\n  box-shadow: inset 0 -6px 0 0 #fff, inset 0 6px 0 0 #fff;\n  background-color: rgba(210, 210, 210, 0.97);\n}\n@media (min-width: 1200px) {\n  #sk-holder #sk-container .content-wrapper {\n    width: 410px;\n    height: calc(640px - 44px);\n  }\n}\n@media (max-width: 768px) or {\n  #sk-holder #sk-container .content-wrapper {\n    width: 100%;\n    height: calc(100% - 44px);\n  }\n}\n#sk-container.sk-embedded {\n  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;\n  font-weight: 400;\n  font-size: 13px;\n  line-height: 1.4;\n  border-radius: 10px 10px 0 0;\n  color: #333;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  -moz-font-smoothing: antialiased;\n  /*!\n *  Font Awesome custom set up\n */\n  /* FONT PATH\n * -------------------------- */\n  height: 100%;\n}\n#sk-container.sk-embedded div,\n#sk-container.sk-embedded a,\n#sk-container.sk-embedded form,\n#sk-container.sk-embedded input,\n#sk-container.sk-embedded label {\n  box-sizing: border-box;\n}\n@font-face {\n  font-family: 'FontAwesome';\n  src: url('//netdna.bootstrapcdn.com/font-awesome/4.5.0/fonts/fontawesome-webfont.eot?v=4.5.0');\n  src: url('//netdna.bootstrapcdn.com/font-awesome/4.5.0/fonts/fontawesome-webfont.eot?#iefix&v=4.5.0') format('embedded-opentype'), url('//netdna.bootstrapcdn.com/font-awesome/4.5.0/fonts/fontawesome-webfont.woff2?v=4.5.0') format('woff2'), url('//netdna.bootstrapcdn.com/font-awesome/4.5.0/fonts/fontawesome-webfont.woff?v=4.5.0') format('woff'), url('//netdna.bootstrapcdn.com/font-awesome/4.5.0/fonts/fontawesome-webfont.ttf?v=4.5.0') format('truetype'), url('//netdna.bootstrapcdn.com/font-awesome/4.5.0/fonts/fontawesome-webfont.svg?v=4.5.0#fontawesomeregular') format('svg');\n  font-weight: normal;\n  font-style: normal;\n}\n#sk-container.sk-embedded .fa {\n  display: inline-block;\n  font: normal normal normal 14px/1 FontAwesome;\n  font-size: inherit;\n  text-rendering: auto;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n#sk-container.sk-embedded .fa-envelope-o:before {\n  content: \"\\F003\";\n}\n#sk-container.sk-embedded .fa-gear:before,\n#sk-container.sk-embedded .fa-cog:before {\n  content: \"\\F013\";\n}\n#sk-container.sk-embedded .fa-check:before {\n  content: \"\\F00C\";\n}\n#sk-container.sk-embedded .fa-times:before {\n  content: \"\\F00D\";\n}\n#sk-container.sk-embedded .fa-arrow-left:before {\n  content: \"\\F060\";\n}\n#sk-container.sk-embedded .fa-camera:before {\n  content: \"\\F030\";\n}\n#sk-container.sk-embedded .fa-arrow-up:before {\n  content: \"\\F062\";\n}\n#sk-container.sk-embedded .fa-angle-right:before {\n  content: \"\\F105\";\n}\n#sk-container.sk-embedded .fa-ellipsis-h:before {\n  content: \"\\F141\";\n}\n#sk-container.sk-embedded .input-group {\n  padding: 5px 0;\n}\n#sk-container.sk-embedded .input-group.has-error .input {\n  border-color: #e54054;\n}\n#sk-container.sk-embedded .input {\n  background-color: #fbfbfb;\n  border: 1px solid #e8e8e8;\n  padding: 0 9px;\n  border-radius: 4px;\n  height: 33px;\n  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;\n  font-size: 13px;\n}\n#sk-container.sk-embedded .input::-webkit-input-placeholder,\n#sk-container.sk-embedded .input:-moz-placeholder,\n#sk-container.sk-embedded .input::-moz-placeholder,\n#sk-container.sk-embedded .input:-ms-input-placeholder {\n  color: #00aeff;\n  opacity: 1;\n}\n#sk-container.sk-embedded .input:focus {\n  background-color: white;\n  color: #212121;\n  outline: 0;\n}\n#sk-container.sk-embedded .btn {\n  display: inline-block;\n  margin-bottom: 0;\n  font-weight: normal;\n  text-align: center;\n  vertical-align: middle;\n  touch-action: manipulation;\n  cursor: pointer;\n  background-image: none;\n  border: 1px solid transparent;\n  white-space: nowrap;\n  padding: 6px 12px;\n  font-size: 14px;\n  line-height: 1.42857143;\n  border-radius: 4px;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n#sk-container.sk-embedded .btn:focus,\n#sk-container.sk-embedded .btn:active:focus,\n#sk-container.sk-embedded .btn.active:focus,\n#sk-container.sk-embedded .btn.focus,\n#sk-container.sk-embedded .btn:active.focus,\n#sk-container.sk-embedded .btn.active.focus {\n  outline: thin dotted;\n  outline: 5px auto -webkit-focus-ring-color;\n  outline-offset: -2px;\n}\n#sk-container.sk-embedded .btn:hover,\n#sk-container.sk-embedded .btn:focus,\n#sk-container.sk-embedded .btn.focus {\n  color: #333;\n  outline: 0;\n  text-decoration: none;\n  opacity: 0.8;\n  filter: alpha(opacity=80);\n}\n#sk-container.sk-embedded .btn:active,\n#sk-container.sk-embedded .btn.active {\n  outline: 0;\n  background-image: none;\n  -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n  box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n}\n#sk-container.sk-embedded .btn.disabled,\n#sk-container.sk-embedded .btn[disabled],\nfieldset[disabled] #sk-container.sk-embedded .btn {\n  cursor: not-allowed;\n  opacity: 0.65;\n  filter: alpha(opacity=65);\n  -webkit-box-shadow: none;\n  box-shadow: none;\n}\na#sk-container.sk-embedded .btn.disabled,\nfieldset[disabled] a#sk-container.sk-embedded .btn {\n  pointer-events: none;\n}\n#sk-container.sk-embedded .btn-sk-primary {\n  color: white;\n  background-color: #00aeff;\n  border-color: #00aeff;\n}\n#sk-container.sk-embedded .btn-sk-primary:focus,\n#sk-container.sk-embedded .btn-sk-primary.focus {\n  color: white;\n  background-color: #008bcc;\n  border-color: #005780;\n}\n#sk-container.sk-embedded .btn-sk-primary:hover {\n  color: white;\n  background-color: #008bcc;\n  border-color: #0084c2;\n}\n#sk-container.sk-embedded .btn-sk-primary:active,\n#sk-container.sk-embedded .btn-sk-primary.active,\n.open > .dropdown-toggle#sk-container.sk-embedded .btn-sk-primary {\n  color: white;\n  background-color: #008bcc;\n  border-color: #0084c2;\n}\n#sk-container.sk-embedded .btn-sk-primary:active:hover,\n#sk-container.sk-embedded .btn-sk-primary.active:hover,\n.open > .dropdown-toggle#sk-container.sk-embedded .btn-sk-primary:hover,\n#sk-container.sk-embedded .btn-sk-primary:active:focus,\n#sk-container.sk-embedded .btn-sk-primary.active:focus,\n.open > .dropdown-toggle#sk-container.sk-embedded .btn-sk-primary:focus,\n#sk-container.sk-embedded .btn-sk-primary:active.focus,\n#sk-container.sk-embedded .btn-sk-primary.active.focus,\n.open > .dropdown-toggle#sk-container.sk-embedded .btn-sk-primary.focus {\n  color: white;\n  background-color: #0073a8;\n  border-color: #005780;\n}\n#sk-container.sk-embedded .btn-sk-primary:active,\n#sk-container.sk-embedded .btn-sk-primary.active,\n.open > .dropdown-toggle#sk-container.sk-embedded .btn-sk-primary {\n  background-image: none;\n}\n#sk-container.sk-embedded .btn-sk-primary.disabled,\n#sk-container.sk-embedded .btn-sk-primary[disabled],\nfieldset[disabled] #sk-container.sk-embedded .btn-sk-primary,\n#sk-container.sk-embedded .btn-sk-primary.disabled:hover,\n#sk-container.sk-embedded .btn-sk-primary[disabled]:hover,\nfieldset[disabled] #sk-container.sk-embedded .btn-sk-primary:hover,\n#sk-container.sk-embedded .btn-sk-primary.disabled:focus,\n#sk-container.sk-embedded .btn-sk-primary[disabled]:focus,\nfieldset[disabled] #sk-container.sk-embedded .btn-sk-primary:focus,\n#sk-container.sk-embedded .btn-sk-primary.disabled.focus,\n#sk-container.sk-embedded .btn-sk-primary[disabled].focus,\nfieldset[disabled] #sk-container.sk-embedded .btn-sk-primary.focus,\n#sk-container.sk-embedded .btn-sk-primary.disabled:active,\n#sk-container.sk-embedded .btn-sk-primary[disabled]:active,\nfieldset[disabled] #sk-container.sk-embedded .btn-sk-primary:active,\n#sk-container.sk-embedded .btn-sk-primary.disabled.active,\n#sk-container.sk-embedded .btn-sk-primary[disabled].active,\nfieldset[disabled] #sk-container.sk-embedded .btn-sk-primary.active {\n  background-color: #00aeff;\n  border-color: #00aeff;\n}\n#sk-container.sk-embedded .btn-sk-primary .badge {\n  color: #00aeff;\n  background-color: white;\n}\n#sk-container.sk-embedded .btn-sk-action-paid {\n  cursor: default;\n  color: #787f8c;\n  background-color: transparent;\n  border-color: #787f8c;\n}\n#sk-container.sk-embedded .btn-sk-action-paid:focus,\n#sk-container.sk-embedded .btn-sk-action-paid.focus {\n  color: #787f8c;\n  background-color: rgba(0, 0, 0, 0);\n  border-color: #3d4148;\n}\n#sk-container.sk-embedded .btn-sk-action-paid:hover {\n  color: #787f8c;\n  background-color: rgba(0, 0, 0, 0);\n  border-color: #5b616b;\n}\n#sk-container.sk-embedded .btn-sk-action-paid:active,\n#sk-container.sk-embedded .btn-sk-action-paid.active,\n.open > .dropdown-toggle#sk-container.sk-embedded .btn-sk-action-paid {\n  color: #787f8c;\n  background-color: rgba(0, 0, 0, 0);\n  border-color: #5b616b;\n}\n#sk-container.sk-embedded .btn-sk-action-paid:active:hover,\n#sk-container.sk-embedded .btn-sk-action-paid.active:hover,\n.open > .dropdown-toggle#sk-container.sk-embedded .btn-sk-action-paid:hover,\n#sk-container.sk-embedded .btn-sk-action-paid:active:focus,\n#sk-container.sk-embedded .btn-sk-action-paid.active:focus,\n.open > .dropdown-toggle#sk-container.sk-embedded .btn-sk-action-paid:focus,\n#sk-container.sk-embedded .btn-sk-action-paid:active.focus,\n#sk-container.sk-embedded .btn-sk-action-paid.active.focus,\n.open > .dropdown-toggle#sk-container.sk-embedded .btn-sk-action-paid.focus {\n  color: #787f8c;\n  background-color: rgba(0, 0, 0, 0);\n  border-color: #3d4148;\n}\n#sk-container.sk-embedded .btn-sk-action-paid:active,\n#sk-container.sk-embedded .btn-sk-action-paid.active,\n.open > .dropdown-toggle#sk-container.sk-embedded .btn-sk-action-paid {\n  background-image: none;\n}\n#sk-container.sk-embedded .btn-sk-action-paid.disabled,\n#sk-container.sk-embedded .btn-sk-action-paid[disabled],\nfieldset[disabled] #sk-container.sk-embedded .btn-sk-action-paid,\n#sk-container.sk-embedded .btn-sk-action-paid.disabled:hover,\n#sk-container.sk-embedded .btn-sk-action-paid[disabled]:hover,\nfieldset[disabled] #sk-container.sk-embedded .btn-sk-action-paid:hover,\n#sk-container.sk-embedded .btn-sk-action-paid.disabled:focus,\n#sk-container.sk-embedded .btn-sk-action-paid[disabled]:focus,\nfieldset[disabled] #sk-container.sk-embedded .btn-sk-action-paid:focus,\n#sk-container.sk-embedded .btn-sk-action-paid.disabled.focus,\n#sk-container.sk-embedded .btn-sk-action-paid[disabled].focus,\nfieldset[disabled] #sk-container.sk-embedded .btn-sk-action-paid.focus,\n#sk-container.sk-embedded .btn-sk-action-paid.disabled:active,\n#sk-container.sk-embedded .btn-sk-action-paid[disabled]:active,\nfieldset[disabled] #sk-container.sk-embedded .btn-sk-action-paid:active,\n#sk-container.sk-embedded .btn-sk-action-paid.disabled.active,\n#sk-container.sk-embedded .btn-sk-action-paid[disabled].active,\nfieldset[disabled] #sk-container.sk-embedded .btn-sk-action-paid.active {\n  background-color: transparent;\n  border-color: #787f8c;\n}\n#sk-container.sk-embedded .btn-sk-action-paid .badge {\n  color: transparent;\n  background-color: #787f8c;\n}\n#sk-container.sk-embedded .btn-sk-action-paid:active,\n#sk-container.sk-embedded .btn-sk-action-paid:hover {\n  -webkit-box-shadow: none;\n  box-shadow: none;\n  border-color: #787f8c;\n}\n#sk-container.sk-embedded .btn-sk-action-processing {\n  cursor: default;\n  color: white;\n  background-color: #00aeff;\n  border-color: #00aeff;\n}\n#sk-container.sk-embedded .btn-sk-action-processing:focus,\n#sk-container.sk-embedded .btn-sk-action-processing.focus {\n  color: white;\n  background-color: #008bcc;\n  border-color: #005780;\n}\n#sk-container.sk-embedded .btn-sk-action-processing:hover {\n  color: white;\n  background-color: #008bcc;\n  border-color: #0084c2;\n}\n#sk-container.sk-embedded .btn-sk-action-processing:active,\n#sk-container.sk-embedded .btn-sk-action-processing.active,\n.open > .dropdown-toggle#sk-container.sk-embedded .btn-sk-action-processing {\n  color: white;\n  background-color: #008bcc;\n  border-color: #0084c2;\n}\n#sk-container.sk-embedded .btn-sk-action-processing:active:hover,\n#sk-container.sk-embedded .btn-sk-action-processing.active:hover,\n.open > .dropdown-toggle#sk-container.sk-embedded .btn-sk-action-processing:hover,\n#sk-container.sk-embedded .btn-sk-action-processing:active:focus,\n#sk-container.sk-embedded .btn-sk-action-processing.active:focus,\n.open > .dropdown-toggle#sk-container.sk-embedded .btn-sk-action-processing:focus,\n#sk-container.sk-embedded .btn-sk-action-processing:active.focus,\n#sk-container.sk-embedded .btn-sk-action-processing.active.focus,\n.open > .dropdown-toggle#sk-container.sk-embedded .btn-sk-action-processing.focus {\n  color: white;\n  background-color: #0073a8;\n  border-color: #005780;\n}\n#sk-container.sk-embedded .btn-sk-action-processing:active,\n#sk-container.sk-embedded .btn-sk-action-processing.active,\n.open > .dropdown-toggle#sk-container.sk-embedded .btn-sk-action-processing {\n  background-image: none;\n}\n#sk-container.sk-embedded .btn-sk-action-processing.disabled,\n#sk-container.sk-embedded .btn-sk-action-processing[disabled],\nfieldset[disabled] #sk-container.sk-embedded .btn-sk-action-processing,\n#sk-container.sk-embedded .btn-sk-action-processing.disabled:hover,\n#sk-container.sk-embedded .btn-sk-action-processing[disabled]:hover,\nfieldset[disabled] #sk-container.sk-embedded .btn-sk-action-processing:hover,\n#sk-container.sk-embedded .btn-sk-action-processing.disabled:focus,\n#sk-container.sk-embedded .btn-sk-action-processing[disabled]:focus,\nfieldset[disabled] #sk-container.sk-embedded .btn-sk-action-processing:focus,\n#sk-container.sk-embedded .btn-sk-action-processing.disabled.focus,\n#sk-container.sk-embedded .btn-sk-action-processing[disabled].focus,\nfieldset[disabled] #sk-container.sk-embedded .btn-sk-action-processing.focus,\n#sk-container.sk-embedded .btn-sk-action-processing.disabled:active,\n#sk-container.sk-embedded .btn-sk-action-processing[disabled]:active,\nfieldset[disabled] #sk-container.sk-embedded .btn-sk-action-processing:active,\n#sk-container.sk-embedded .btn-sk-action-processing.disabled.active,\n#sk-container.sk-embedded .btn-sk-action-processing[disabled].active,\nfieldset[disabled] #sk-container.sk-embedded .btn-sk-action-processing.active {\n  background-color: #00aeff;\n  border-color: #00aeff;\n}\n#sk-container.sk-embedded .btn-sk-action-processing .badge {\n  color: #00aeff;\n  background-color: white;\n}\n#sk-container.sk-embedded .btn-sk-action-processing:active,\n#sk-container.sk-embedded .btn-sk-action-processing:hover,\n#sk-container.sk-embedded .btn-sk-action-processing:active:hover {\n  -webkit-box-shadow: none;\n  box-shadow: none;\n  background-color: #00aeff;\n  border-color: #00aeff;\n}\n#sk-container.sk-embedded a.btn {\n  text-decoration: none;\n}\n#sk-container.sk-embedded .btn-sk-link {\n  color: #337ab7;\n  font-weight: normal;\n  border-radius: 0;\n}\n#sk-container.sk-embedded .btn-sk-link,\n#sk-container.sk-embedded .btn-sk-link:active,\n#sk-container.sk-embedded .btn-sk-link.active,\n#sk-container.sk-embedded .btn-sk-link[disabled],\nfieldset[disabled] #sk-container.sk-embedded .btn-sk-link {\n  background-color: transparent;\n  -webkit-box-shadow: none;\n  box-shadow: none;\n}\n#sk-container.sk-embedded .btn-sk-link,\n#sk-container.sk-embedded .btn-sk-link:hover,\n#sk-container.sk-embedded .btn-sk-link:focus,\n#sk-container.sk-embedded .btn-sk-link:active {\n  border-color: transparent;\n}\n#sk-container.sk-embedded .btn-sk-link:hover,\n#sk-container.sk-embedded .btn-sk-link:focus {\n  color: #23527c;\n  text-decoration: underline;\n  background-color: transparent;\n}\n#sk-container.sk-embedded .btn-sk-link[disabled]:hover,\nfieldset[disabled] #sk-container.sk-embedded .btn-sk-link:hover,\n#sk-container.sk-embedded .btn-sk-link[disabled]:focus,\nfieldset[disabled] #sk-container.sk-embedded .btn-sk-link:focus {\n  color: #777777;\n  text-decoration: none;\n}\n#sk-container.sk-embedded #sk-header {\n  z-index: 10;\n  height: 32px;\n  line-height: 28px;\n  padding: 6px 18px;\n  position: relative;\n  background-color: #f4f4f4;\n  cursor: pointer;\n  border-radius: 8px 8px 0 0;\n  font-size: 16px;\n  font-weight: 400;\n  box-sizing: content-box;\n  border-bottom: 1px solid #eee;\n  text-align: center;\n}\n#sk-container.sk-embedded #sk-header .fa {\n  line-height: 28px;\n  color: #808080;\n  font-size: 15px;\n}\n#sk-container.sk-embedded #sk-header .sk-close-handle,\n#sk-container.sk-embedded #sk-header .sk-show-handle {\n  cursor: pointer;\n  position: absolute;\n  top: 6px;\n  right: 10px;\n}\n@media (min-width: 768px) {\n  #sk-container.sk-embedded #sk-header .sk-show-handle {\n    display: none;\n  }\n}\n#sk-container.sk-embedded #sk-header .sk-back-handle {\n  cursor: pointer;\n  display: inline-block;\n  margin-right: 8px;\n  height: 30px;\n}\n#sk-container.sk-embedded #sk-header .sk-close-handle .fa {\n  font-size: 17px;\n}\n#sk-container.sk-embedded #sk-header .settings-content {\n  display: inline-block;\n  height: 44px;\n  margin-top: -6px;\n  margin-left: -18px;\n}\n#sk-container.sk-embedded #sk-header .settings-content > div {\n  margin-top: 6px;\n  margin-left: 18px;\n}\n#sk-container.sk-embedded #sk-badge {\n  background-color: #e54054;\n  border-radius: 100px;\n  box-shadow: 0 0 0 1px #cf2615;\n  color: white;\n  position: absolute;\n  top: 11px;\n  left: 10px;\n  padding: 0 6px;\n  font-size: 12px;\n  font-weight: 400;\n  line-height: 18px;\n}\n#sk-container.sk-embedded #sk-settings-handle {\n  cursor: pointer;\n  position: absolute;\n  top: 7px;\n  right: 27px;\n  width: 25px;\n  display: none;\n}\n#sk-container.sk-embedded.sk-appear #sk-settings-handle {\n  display: block;\n}\n#sk-container.sk-embedded #sk-settings-header {\n  z-index: 10;\n  height: 32px;\n  line-height: 28px;\n  padding: 6px 18px;\n  position: relative;\n  background-color: #f4f4f4;\n  cursor: pointer;\n  border-radius: 8px 8px 0 0;\n  font-size: 16px;\n  font-weight: 400;\n  box-sizing: content-box;\n  border-bottom: 1px solid #eee;\n}\n#sk-container.sk-embedded #sk-settings-header .fa {\n  line-height: 28px;\n  color: #808080;\n  font-size: 15px;\n}\n#sk-container.sk-embedded #sk-settings-header .sk-close-handle,\n#sk-container.sk-embedded #sk-settings-header .sk-show-handle {\n  cursor: pointer;\n  position: absolute;\n  top: 6px;\n  right: 10px;\n}\n@media (min-width: 768px) {\n  #sk-container.sk-embedded #sk-settings-header .sk-show-handle {\n    display: none;\n  }\n}\n#sk-container.sk-embedded #sk-settings-header .sk-back-handle {\n  cursor: pointer;\n  display: inline-block;\n  margin-right: 8px;\n  height: 30px;\n}\n#sk-container.sk-embedded #sk-settings-header .sk-close-handle .fa {\n  font-size: 17px;\n}\n#sk-container.sk-embedded #sk-settings-header .settings-content {\n  display: inline-block;\n  height: 44px;\n  margin-top: -6px;\n  margin-left: -18px;\n}\n#sk-container.sk-embedded #sk-settings-header .settings-content > div {\n  margin-top: 6px;\n  margin-left: 18px;\n}\n#sk-container.sk-embedded .sk-notification-container {\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);\n  position: absolute;\n  width: 100%;\n  z-index: 1;\n}\n#sk-container.sk-embedded .sk-notification-container .sk-notification {\n  overflow: hidden;\n  height: 56px;\n  width: 100%;\n  border-top: 1px solid rgba(0, 0, 0, 0.1);\n  background-color: white;\n}\n#sk-container.sk-embedded .sk-notification-container .sk-notification.long-text {\n  height: 75px;\n}\n#sk-container.sk-embedded .sk-notification-container .sk-notification p {\n  margin: 18px 18px;\n}\n#sk-container.sk-embedded .sk-notification-container .sk-notification p a {\n  color: #00aeff;\n}\n#sk-container.sk-embedded .sk-notification-container .sk-notification p .sk-notification-close {\n  font-size: 20px;\n  font-weight: 600;\n  position: absolute;\n  top: 0;\n  right: 10px;\n  display: block;\n  width: 22px;\n  height: 32px;\n  padding-left: 10px;\n  text-decoration: none;\n  color: #808080;\n}\n#sk-container.sk-embedded .sk-notification-container .sk-notification.sk-notification-error {\n  background-color: #e54054;\n  color: white;\n}\n#sk-container.sk-embedded .sk-notification-container .sk-notification.sk-notification-error .sk-notification-close {\n  color: white;\n}\n#sk-container.sk-embedded .sk-notification-container .sk-notification-enter {\n  height: 0;\n}\n#sk-container.sk-embedded .sk-notification-container .sk-notification-enter-active {\n  -webkit-transition: height 500ms;\n  -o-transition: height 500ms;\n  transition: height 500ms;\n  height: 56px;\n}\n#sk-container.sk-embedded .sk-notification-container .sk-notification-leave {\n  height: 56px;\n}\n#sk-container.sk-embedded .sk-notification-container .sk-notification-leave-active {\n  -webkit-transition: height 500ms;\n  -o-transition: height 500ms;\n  transition: height 500ms;\n  height: 0;\n}\n#sk-container.sk-embedded #sk-conversation {\n  position: relative;\n  padding: 0;\n  height: calc(100% - 89px);\n  overflow-y: scroll;\n  overflow-x: hidden;\n  -webkit-overflow-scrolling: touch;\n  -webkit-transition: padding-top 500ms;\n  -o-transition: padding-top 500ms;\n  transition: padding-top 500ms;\n}\n@media (max-width: 768px) {\n  #sk-container.sk-embedded #sk-conversation {\n    height: calc(100%  - 89px);\n  }\n}\n#sk-container.sk-embedded #sk-conversation.notification-shown {\n  padding-top: 56px;\n}\n#sk-container.sk-embedded #sk-conversation .sk-intro-section {\n  background-color: #F8F9FA;\n  padding: 18px 18px 22px 18px;\n  border-bottom: solid 1px #E6E6E6;\n}\n#sk-container.sk-embedded #sk-conversation .sk-intro-section .app-name {\n  color: #464646;\n  font-size: 18px;\n  font-weight: bold;\n}\n#sk-container.sk-embedded #sk-conversation .sk-intro-section .intro-text {\n  color: #787f8c;\n  font-size: 13px;\n  line-height: 1.3;\n  margin-top: 8px;\n}\n#sk-container.sk-embedded #sk-conversation .sk-intro-section .app-icon {\n  float: left;\n  width: 50px;\n  height: 50px;\n  border-radius: 50%;\n}\n#sk-container.sk-embedded #sk-conversation .sk-intro-section .app-name,\n#sk-container.sk-embedded #sk-conversation .sk-intro-section .intro-text {\n  margin-left: 68px;\n}\n#sk-container.sk-embedded #sk-conversation .sk-intro-section .available-channels {\n  margin-top: 22px;\n  text-align: center;\n  color: #787f8c;\n}\n#sk-container.sk-embedded #sk-conversation .sk-intro-section .available-channels .channel-icon {\n  cursor: pointer;\n  margin-right: 13px;\n}\n#sk-container.sk-embedded #sk-conversation .sk-intro-section .available-channels .channel-icon:last-child {\n  margin-right: 0;\n}\n#sk-container.sk-embedded #sk-conversation .sk-messages-container {\n  position: absolute;\n  bottom: 0;\n  width: 100%;\n  max-height: 100%;\n}\n#sk-container.sk-embedded #sk-conversation .sk-messages {\n  padding: 0 15px 0 5px;\n}\n#sk-container.sk-embedded #sk-conversation .sk-row {\n  clear: both;\n  padding-bottom: 0px;\n  padding-top: 2px;\n}\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper {\n  max-width: 100%;\n  position: relative;\n}\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg,\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg-image {\n  font-size: 14px;\n  line-height: 1.25;\n  position: relative;\n  border-radius: 14px;\n  border-left-color: #00aeff;\n  margin-bottom: 10px;\n}\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg.sk-msg-appmaker-first,\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg-image.sk-msg-appmaker-first {\n  border-bottom-left-radius: 2px;\n  margin-bottom: 0px;\n}\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg.sk-msg-appmaker-middle,\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg-image.sk-msg-appmaker-middle {\n  border-bottom-left-radius: 2px;\n  border-top-left-radius: 2px;\n  margin-bottom: 0px;\n}\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg.sk-msg-appmaker-last,\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg-image.sk-msg-appmaker-last {\n  border-top-left-radius: 2px;\n  margin-bottom: 3px;\n}\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg.sk-msg-appuser-first,\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg-image.sk-msg-appuser-first {\n  border-bottom-right-radius: 2px;\n  margin-bottom: 0px;\n}\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg.sk-msg-appuser-middle,\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg-image.sk-msg-appuser-middle {\n  border-bottom-right-radius: 2px;\n  border-top-right-radius: 2px;\n  margin-bottom: 0px;\n}\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg.sk-msg-appuser-last,\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg-image.sk-msg-appuser-last {\n  border-top-right-radius: 2px;\n}\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg .imageloader,\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg-image .imageloader {\n  display: block;\n  border-radius: inherit;\n  overflow: hidden;\n}\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg .preloader-container,\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg-image .preloader-container {\n  min-width: 150px;\n  min-height: 100px;\n}\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg .preloader-container img,\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg-image .preloader-container img {\n  max-width: 100%;\n}\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg .image-container,\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg-image .image-container {\n  position: relative;\n  border-radius: inherit;\n}\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg .image-overlay,\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg-image .image-overlay {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(255, 255, 255, 0.5);\n}\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg .spinner,\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg-image .spinner {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg img,\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg-image img {\n  max-width: 100%;\n}\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg .three-bounce .bounce1,\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg-image .three-bounce .bounce1,\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg .three-bounce .bounce2,\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg-image .three-bounce .bounce2,\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg .three-bounce .bounce3,\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg-image .three-bounce .bounce3 {\n  height: 15px;\n  width: 15px;\n  background-color: #00aeff;\n}\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg {\n  padding: 8px 13px 9px;\n  line-height: 1.3;\n  word-break: break-word;\n  word-wrap: break-word;\n  -webkit-hyphens: auto;\n  -moz-hyphens: auto;\n  -ms-hyphens: auto;\n  -o-hyphens: auto;\n  hyphens: auto;\n}\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg .has-actions {\n  margin-bottom: 5px;\n  display: inline-block;\n}\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-msg a.link {\n  text-decoration: underline;\n}\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-action {\n  margin-bottom: 5px;\n}\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-action .btn {\n  white-space: inherit;\n  -webkit-transition: 'width' 100ms;\n  -o-transition: 'width' 100ms;\n  transition: 'width' 100ms;\n}\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-action:last-child {\n  margin-bottom: 0px;\n}\n#sk-container.sk-embedded #sk-conversation .sk-row .sk-msg-wrapper .sk-action a.btn {\n  display: block;\n  border-radius: 7px;\n  margin-right: 8px;\n  margin-left: 8px;\n}\n#sk-container.sk-embedded #sk-conversation .sk-row.sk-left-row .sk-msg-wrapper {\n  display: inline-block;\n}\n#sk-container.sk-embedded #sk-conversation .sk-row.sk-left-row .sk-msg-wrapper .sk-msg,\n#sk-container.sk-embedded #sk-conversation .sk-row.sk-left-row .sk-msg-wrapper .sk-msg-image {\n  background-color: #f4f4f4;\n  color: #424242;\n  max-width: 200px;\n}\n#sk-container.sk-embedded #sk-conversation .sk-row.sk-left-row .sk-msg-wrapper .sk-msg:after,\n#sk-container.sk-embedded #sk-conversation .sk-row.sk-left-row .sk-msg-wrapper .sk-msg-image:after {\n  right: 100%;\n  border-color: rgba(236, 236, 236, 0);\n  border-right-color: white;\n}\n#sk-container.sk-embedded #sk-conversation .sk-row.sk-left-row .sk-msg-wrapper .sk-msg a.link,\n#sk-container.sk-embedded #sk-conversation .sk-row.sk-left-row .sk-msg-wrapper .sk-msg-image a.link,\n#sk-container.sk-embedded #sk-conversation .sk-row.sk-left-row .sk-msg-wrapper .sk-msg a.link:visited,\n#sk-container.sk-embedded #sk-conversation .sk-row.sk-left-row .sk-msg-wrapper .sk-msg-image a.link:visited {\n  color: #00aeff;\n}\n#sk-container.sk-embedded #sk-conversation .sk-row.sk-left-row .sk-msg-avatar {\n  width: 31px;\n  border-radius: 50%;\n  margin-right: 5px;\n  margin-bottom: -11px;\n  display: inline-block;\n  margin-left: 9px;\n}\n#sk-container.sk-embedded #sk-conversation .sk-row.sk-left-row .sk-msg-avatar.sk-msg-avatar-img {\n  margin-bottom: 0px;\n}\n#sk-container.sk-embedded #sk-conversation .sk-row.sk-left-row .sk-msg-avatar-placeholder {\n  width: 35px;\n  display: inline-block;\n  margin-right: 10px;\n}\n#sk-container.sk-embedded #sk-conversation .sk-row.sk-right-row .sk-msg,\n#sk-container.sk-embedded #sk-conversation .sk-row.sk-right-row .sk-msg-image {\n  background-color: #00aeff;\n  float: right;\n  color: white;\n  max-width: 204px;\n}\n#sk-container.sk-embedded #sk-conversation .sk-row.sk-right-row .sk-msg:after,\n#sk-container.sk-embedded #sk-conversation .sk-row.sk-right-row .sk-msg-image:after {\n  left: 100%;\n  border-color: rgba(0, 174, 255, 0);\n  border-left-color: inherit;\n}\n#sk-container.sk-embedded #sk-conversation .sk-row.sk-right-row .sk-msg a.link,\n#sk-container.sk-embedded #sk-conversation .sk-row.sk-right-row .sk-msg-image a.link,\n#sk-container.sk-embedded #sk-conversation .sk-row.sk-right-row .sk-msg a.link:visited,\n#sk-container.sk-embedded #sk-conversation .sk-row.sk-right-row .sk-msg-image a.link:visited {\n  color: white;\n}\n#sk-container.sk-embedded #sk-conversation .sk-row.sk-right-row .sk-msg-image {\n  background-color: transparent;\n}\n#sk-container.sk-embedded #sk-conversation .sk-row:last-child {\n  padding-bottom: 10px;\n}\n#sk-container.sk-embedded #sk-conversation .sk-clear {\n  clear: both;\n}\n#sk-container.sk-embedded #sk-conversation::-webkit-scrollbar-track {\n  border-radius: 10px;\n  box-shadow: inset 0 -6px 0 0 #fff, inset 0 6px 0 0 #fff;\n  background-color: #f4f4f4;\n}\n#sk-container.sk-embedded #sk-conversation::-webkit-scrollbar {\n  width: 8px;\n  background-color: #fff;\n}\n#sk-container.sk-embedded #sk-conversation::-webkit-scrollbar-thumb {\n  border-radius: 10px;\n  box-shadow: inset 0 -6px 0 0 #fff, inset 0 6px 0 0 #fff;\n  background-color: rgba(210, 210, 210, 0.97);\n}\n#sk-container.sk-embedded #sk-conversation .sk-logo {\n  margin-bottom: 10px;\n  margin-left: calc(50% - 83px);\n}\n#sk-container.sk-embedded #sk-conversation .sk-logo a {\n  font-size: 12px;\n  color: #bbb;\n  text-decoration: none;\n}\n#sk-container.sk-embedded #sk-conversation .sk-logo .sk-image {\n  position: relative;\n  left: 2px;\n  top: 3px;\n  width: 87px;\n  vertical-align: baseline;\n}\n#sk-container.sk-embedded #sk-conversation .sk-from {\n  white-space: nowrap;\n  top: -20px;\n  font-size: 12px;\n  color: #787f8c;\n  padding-left: 12px;\n  margin-bottom: 2px;\n  margin-left: 45px;\n}\n#sk-container.sk-embedded #sk-conversation .connect-notification {\n  padding: 21px 42px;\n  line-height: 1.3;\n  font-size: 14px;\n  text-align: center;\n}\n#sk-container.sk-embedded #sk-conversation .connect-notification p {\n  color: #b2b2b2;\n}\n#sk-container.sk-embedded #sk-conversation .connect-notification .connect-notification-channels {\n  padding-top: 5px;\n}\n#sk-container.sk-embedded #sk-conversation .connect-notification .connect-notification-channels .channel-details {\n  padding-left: 5px;\n  padding-right: 5px;\n  display: inline-block;\n}\n#sk-container.sk-embedded #sk-conversation .connect-notification .connect-notification-channels .channel-details .channel-link {\n  color: #00aeff;\n  display: inline-block;\n}\n#sk-container.sk-embedded #sk-footer {\n  position: relative;\n  width: 100%;\n  height: 45px;\n  bottom: 0;\n  left: 0;\n  border: none;\n  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.1);\n  background-color: white;\n  z-index: 1;\n}\n#sk-container.sk-embedded #sk-footer .image-upload {\n  height: 45px;\n  width: 35px;\n  color: #b2b2b2;\n  display: inline-block;\n  padding: 15px 10px;\n  font-size: 14px;\n  line-height: 14px;\n}\n#sk-container.sk-embedded #sk-footer .image-upload:hover {\n  color: #00aeff;\n}\n#sk-container.sk-embedded #sk-footer .image-upload input[type=\"file\"] {\n  position: fixed;\n  top: -1000px;\n}\n#sk-container.sk-embedded #sk-footer form {\n  display: inline-block;\n}\n#sk-container.sk-embedded #sk-footer .input-container {\n  width: 100%;\n  padding: 5px 0;\n  display: inline-block;\n}\n#sk-container.sk-embedded #sk-footer .input-container.no-upload {\n  padding: 5px 0 5px 9px;\n}\n#sk-container.sk-embedded #sk-footer .input-container .message-input {\n  width: 100%;\n  -webkit-appearance: none;\n}\n#sk-container.sk-embedded #sk-footer .input-container .message-input::-ms-clear {\n  display: none;\n}\n#sk-container.sk-embedded #sk-footer .input-container .message-input:-ms-input-placeholder {\n  color: #b2b2b2;\n}\n#sk-container.sk-embedded #sk-footer .send {\n  margin-top: 1px;\n  color: #b2b2b2;\n  font-weight: 600;\n  position: relative;\n  height: 45px;\n  line-height: 42px;\n  text-decoration: none;\n  padding: 0 10px;\n  cursor: pointer;\n  display: inline-block;\n}\n#sk-container.sk-embedded #sk-footer .send.active {\n  color: #00aeff;\n}\n#sk-container.sk-embedded #sk-footer .send.active:hover {\n  opacity: 0.8;\n  filter: alpha(opacity=80);\n}\n#sk-container.sk-embedded .sk-settings {\n  box-sizing: border-box;\n  border-top: 1px solid rgba(0, 0, 0, 0.1);\n  position: absolute;\n  z-index: 2;\n  background-color: white;\n  overflow: hidden;\n  opacity: 1;\n  font-size: 12px;\n  color: #787f8c;\n  width: 100%;\n  height: 100%;\n}\n#sk-container.sk-embedded .sk-settings .settings-wrapper {\n  padding: 30px 40px;\n  box-sizing: border-box;\n}\n#sk-container.sk-embedded .sk-settings .settings-wrapper .input-group {\n  position: relative;\n}\n#sk-container.sk-embedded .sk-settings .settings-wrapper .input-group i.before-icon {\n  color: #bdbdbd;\n  position: absolute;\n  top: 16px;\n  left: 11px;\n}\n#sk-container.sk-embedded .sk-settings .settings-wrapper .input-group .email-input {\n  box-sizing: border-box;\n  padding: 0 9px 0 30px;\n  width: 100%;\n}\n#sk-container.sk-embedded .sk-settings .settings-wrapper .input-group .form-message {\n  padding: 6px 12px;\n  font-size: 14px;\n  line-height: 1.42857143;\n  border-radius: 4px;\n  vertical-align: middle;\n}\n#sk-container.sk-embedded .sk-settings .settings-wrapper .input-group .form-message i.success {\n  color: #5cb85c;\n}\n#sk-container.sk-embedded .sk-settings .settings-wrapper .settings-header {\n  font-weight: 700;\n  font-size: 15px;\n  color: #464646;\n  margin-bottom: 15px;\n}\n#sk-container.sk-embedded .sk-settings .settings-wrapper .settings-description {\n  font-size: 13px;\n}\n#sk-container.sk-embedded .sk-settings.settings-enter {\n  width: 0;\n}\n#sk-container.sk-embedded .sk-settings.settings-enter-active {\n  -webkit-transition: width 250ms;\n  -o-transition: width 250ms;\n  transition: width 250ms;\n  width: 100%;\n}\n#sk-container.sk-embedded .sk-settings.settings-leave {\n  width: 100%;\n}\n#sk-container.sk-embedded .sk-settings.settings-leave-active {\n  -webkit-transition: width 250ms;\n  -o-transition: width 250ms;\n  transition: width 250ms;\n  width: 0;\n}\n#sk-container.sk-embedded .sk-settings .channels {\n  margin-top: 30px;\n}\n#sk-container.sk-embedded .sk-settings .channels .channel-item {\n  cursor: pointer;\n}\n#sk-container.sk-embedded .sk-settings .channels .channel-item.channel-item-linked .channel-item-right {\n  color: #00aeff;\n  text-decoration: underline;\n}\n#sk-container.sk-embedded .sk-settings .channels .channel-item:first-child .channel-item-name {\n  border-top: 1px solid #EFEFEF;\n}\n#sk-container.sk-embedded .sk-settings .channels .channel-item .channel-item-header {\n  position: relative;\n}\n#sk-container.sk-embedded .sk-settings .channels .channel-item .channel-item-header .channel-item-icon {\n  width: 26px;\n  position: absolute;\n  display: inline-block;\n  vertical-align: middle;\n  top: 9px;\n}\n#sk-container.sk-embedded .sk-settings .channels .channel-item .channel-item-header .channel-item-content {\n  display: inline-block;\n  margin-left: 38px;\n  border-bottom: 1px solid #EFEFEF;\n  width: calc(100% - 26px - 12px);\n}\n#sk-container.sk-embedded .sk-settings .channels .channel-item .channel-item-header .channel-item-content .channel-item-name {\n  font-size: 13px;\n  color: #464646;\n  line-height: 43px;\n}\n#sk-container.sk-embedded .sk-settings .channels .channel-item .channel-item-header .channel-item-content .channel-item-connected-as {\n  margin-bottom: 10px;\n  margin-top: -10px;\n  font-size: 10px;\n}\n#sk-container.sk-embedded .sk-settings .channels .channel-item .channel-item-header .channel-item-right {\n  position: absolute;\n  right: 0;\n  height: 45px;\n  line-height: 45px;\n  display: inline-block;\n}\n#sk-container.sk-embedded .sk-settings .channels .channel-item .channel-item-header .channel-item-right i.fa {\n  font: normal normal normal 12px/45px FontAwesome;\n  color: #787f8c;\n  font-size: 13px;\n}\n#sk-container.sk-embedded .sk-channel {\n  box-sizing: border-box;\n  border-top: 1px solid rgba(0, 0, 0, 0.1);\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  z-index: 3;\n  background-color: white;\n  overflow: hidden;\n  opacity: 1;\n  text-align: center;\n  line-height: 1.5;\n  font-size: 14px;\n}\n#sk-container.sk-embedded .sk-channel.sk-channel-visible {\n  -webkit-transition: width 250ms;\n  -o-transition: width 250ms;\n  transition: width 250ms;\n  width: 100%;\n}\n#sk-container.sk-embedded .sk-channel.sk-channel-hidden {\n  -webkit-transition: width 250ms;\n  -o-transition: width 250ms;\n  transition: width 250ms;\n  width: 0;\n}\n#sk-container.sk-embedded .sk-channel .content-wrapper {\n  padding: 40px 40px;\n}\n#sk-container.sk-embedded .sk-channel .channel-header .channel-icon {\n  margin-bottom: 40px;\n  height: 65px;\n}\n#sk-container.sk-embedded .sk-channel .channel-header .channel-name {\n  font-size: 18px;\n  color: #464646;\n  font-weight: 600;\n  margin-bottom: 10px;\n}\n#sk-container.sk-embedded .sk-channel .channel-header .channel-description {\n  margin-bottom: 20px;\n  color: #787f8c;\n}\n#sk-container.sk-embedded .sk-channel .channel-content {\n  overflow: hidden;\n}\n#sk-container.sk-embedded .sk-channel .channel-content a,\n#sk-container.sk-embedded .sk-channel .channel-content a:visited {\n  color: #00aeff;\n}\n#sk-container.sk-embedded .sk-channel .channel-content a.sk-error-link,\n#sk-container.sk-embedded .sk-channel .channel-content a:visited.sk-error-link {\n  color: #e54054;\n  cursor: pointer;\n}\n#sk-container.sk-embedded .sk-channel .channel-content .channel-content-value {\n  font-weight: 600;\n  color: #464646;\n}\n#sk-container.sk-embedded .sk-channel .sk-fb-button-wrapper {\n  text-align: left;\n}\n#sk-container.sk-embedded .sk-channel .fb-send-to-messenger {\n  margin-left: 54px;\n}\n@media (max-width: 330px) {\n  #sk-container.sk-embedded .sk-channel .fb-send-to-messenger {\n    margin-left: 0;\n  }\n}\n@media (min-width: 1200px) {\n  #sk-container.sk-embedded .sk-channel .fb-send-to-messenger {\n    margin-left: 90px;\n  }\n}\n#sk-container.sk-embedded.sk-appear .sk-appear-hidden {\n  display: none;\n}\n#sk-container.sk-embedded.sk-appear .sk-appear-visible {\n  display: block;\n}\n#sk-container.sk-embedded.sk-close .sk-close-hidden {\n  display: none;\n}\n#sk-container.sk-embedded.sk-close .sk-close-visible {\n  display: block;\n}\n#sk-container.sk-embedded #sk-wrapper {\n  background: #fff;\n  width: 100%;\n  height: 100%;\n  position: relative;\n}\n#sk-container.sk-embedded #sk-header,\n#sk-container.sk-embedded #sk-settings-header {\n  cursor: default;\n  border-radius: 0;\n}\n#sk-container.sk-embedded #sk-header .sk-close-handle,\n#sk-container.sk-embedded #sk-settings-header .sk-close-handle,\n#sk-container.sk-embedded #sk-header .sk-show-handle,\n#sk-container.sk-embedded #sk-settings-header .sk-show-handle {\n  display: none;\n}\n#sk-container.sk-embedded #sk-conversation {\n  height: calc(100% - 89px);\n}\n#sk-container.sk-embedded #sk-conversation .sk-messages-container {\n  position: relative;\n}\n#sk-container.sk-embedded #sk-settings-handle {\n  display: block;\n  right: 10px;\n}\n#sk-container.sk-embedded #sk-footer {\n  box-shadow: none;\n  height: 50px;\n}\n#sk-container.sk-embedded .sk-settings {\n  width: 100%;\n  height: 480px;\n}\n@media (max-width: 768px) {\n  html.sk-widget-opened,\n  html.sk-widget-opened body {\n    overflow: hidden;\n    position: relative;\n    -webkit-overflow-scrolling: auto;\n    max-height: 100%;\n    height: 100%;\n    width: 100%;\n  }\n  html.sk-widget-opened #sk-holder #sk-container #sk-header #sk-settings-handle,\n  html.sk-widget-opened body #sk-holder #sk-container #sk-header #sk-settings-handle {\n    height: 40px;\n    width: 40px;\n    right: 40px;\n  }\n  html.sk-widget-opened #sk-holder #sk-container #sk-header .sk-close-handle,\n  html.sk-widget-opened body #sk-holder #sk-container #sk-header .sk-close-handle {\n    height: 40px;\n    width: 40px;\n    right: 0;\n  }\n}\n#sk-container.sk-ios-device {\n  -webkit-text-size-adjust: 100%;\n}\n", ""]);

	// exports


/***/ },
/* 108 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
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


/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(108)();
	// imports


	// module
	exports.push([module.id, ".three-bounce > div {\n  width: 18px;\n  height: 18px;\n  background-color: #333;\n\n  border-radius: 100%;\n  display: inline-block;\n  -webkit-animation: bouncedelay 1.4s infinite ease-in-out;\n  animation: bouncedelay 1.4s infinite ease-in-out;\n  /* Prevent first frame from flickering when animation starts */\n  -webkit-animation-fill-mode: both;\n  animation-fill-mode: both;\n}\n\n.three-bounce .bounce1 {\n  -webkit-animation-delay: -0.32s;\n  animation-delay: -0.32s;\n}\n\n.three-bounce .bounce2 {\n  -webkit-animation-delay: -0.16s;\n  animation-delay: -0.16s;\n}\n\n@-webkit-keyframes bouncedelay {\n  0%, 80%, 100% { -webkit-transform: scale(0.0) }\n  40% { -webkit-transform: scale(1.0) }\n}\n\n@keyframes bouncedelay {\n  0%, 80%, 100% {\n    transform: scale(0.0);\n    -webkit-transform: scale(0.0);\n  } 40% {\n    transform: scale(1.0);\n    -webkit-transform: scale(1.0);\n  }\n}\n", ""]);

	// exports


/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
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

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
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

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "e0fcb9f29bbe719fa21691fe1262984c.png";

/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "5d489809c04861e435d327c7d546f210.png";

/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "a4c1e7e6066665926d65ea3e390f2897.mp3";

/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "8ddaae5507ef13e91e228c0494fd0ae1.png";

/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "cf7d50f932399b510d57cd887c902680.png";

/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "81567450d8214329730cd429cb4083ff.png";

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "be3521c4cdb428a90dc223e76ab16f32.png";

/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "d7e8b61376385a28b28e39f1d540763c.png";

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "8d6e8ba2b2bbcd3a28f1b648d41933a5.png";

/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "3a9b9d0f58b2c72b377140b1785431f3.png";

/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "8a4e62acad2efc17712c6ee9bf817e87.png";

/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "3d749cd8b8acdedf5946eda8262a8d50.png";

/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "306759ba7ce35ad0661700c7fc36436f.png";

/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "dd2e95e53165b41a8cfc5a619503c7b4.png";

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "62d66710100627758e2ad0721374a338.png";

/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "2bc532f57a2074a56fc036334188e40a.png";

/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "a04c744232a3e4641901aa7eab43e4c9.png";

/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "83c94bf974d59ac0ed59f8a69b48bdcf.png";

/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "789661b37d36dbe43de410be5859046e.png";

/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "9d69b94a58a6503b6d6723476ebba41e.png";

/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "ed19ebc9f250c552758aa8bc1a52930e.png";

/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "b1d879a94d135c4586d499f377bc7418.png";

/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "3bb5fdadad6d0bb8b1a006e7cfa18c5f.png";

/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "2b5e86da0f91443e8a83f7883ca9d10f.png";

/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "c29f8c28476fc435a2d84a2679d3edd7.png";

/***/ },
/* 136 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "bca0d1056c4ee94c28fdc9b05f79e1d8.png";

/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "01cdbc116ccf9464f924722b7be66b25.png";

/***/ }
/******/ ]);