# [Smooch Web Messenger](https://smooch.io)

  [![npm version](https://badge.fury.io/js/smooch.svg)](http://badge.fury.io/js/smooch)

Smooch is the best way to have personal, rich conversations with people on your website or customers on any device. Our features, integrations and developer-friendly APIs empower companies to connect with their customers in a whole new way.

The Smooch Web Messenger will add [live web messaging](https://smooch.io/live-web-chat/) to your website or web app. Customers will be able to talk to you from your website, while you manage conversations using your favorite business systems.

- Let your customers talk to you the way they want by seamlessly [moving web chat conversations](https://smooch.io/cross-channel-messaging/) to any messaging app.
- Sync conversations across every device and channel your customers use.
- Build better relationships with messaging that feels and looks tailored to your website.
- Delight your customers with the most engaging conversational experience using [rich messaging](https://smooch.io/rich-messaging/).
- Maximize development productivity with a single codebase across platforms and [add more channels](https://smooch.io/cross-channel-messaging/) anytime.
- Bring every conversation into your existing business systems. No new tool to learn. [See all integrations](https://smooch.io/integrations/).

## Usage

### Script Tag

Add the following code towards the end of the `head` section on your page.

```html
<script>
    !function(t){function e(i){if(n[i])return n[i].exports;var o=n[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var n={};e.m=t,e.c=n,e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="https://cdn.smooch.io/",e(e.s=2)}([function(t,e,n){"use strict";function i(t){"complete"!==document.readyState&&"loaded"!==document.readyState&&"interactive"!==document.readyState||!document.body?document.addEventListener("DOMContentLoaded",function(){t()}):t()}function o(t){var e=["screen"];return t.minHeight&&e.push("(min-height: "+t.minHeight+"px)"),t.maxHeight&&e.push("(max-height: "+t.maxHeight+"px)"),t.minWidth&&e.push("(min-width: "+t.minWidth+"px)"),t.maxWidth&&e.push("(max-width: "+t.maxWidth+"px)"),e.join(" and ")}Object.defineProperty(e,"__esModule",{value:!0}),e.waitForPage=i,e.generateMediaQuery=o},function(t,e){function n(t,e){var n=0,i=t.length;for(n;n<i&&!1!==e(t[n],n);n++);}function i(t){return"[object Array]"===Object.prototype.toString.apply(t)}function o(t){return"function"==typeof t}t.exports={isFunction:o,isArray:i,each:n}},function(t,e,n){"use strict";(function(t){var e=n(4),i=function(t){return t&&t.__esModule?t:{default:t}}(e);window.__onWebMessengerHostReady__?window.__onWebMessengerHostReady__(i.default):t.Smooch=i.default}).call(e,n(3))},function(t,e){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(t){"object"==typeof window&&(n=window)}t.exports=n},function(t,e,n){"use strict";function i(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return Array.from(t)}function o(){A=void 0,u=void 0,window.__onWebMessengerFrameReady__=r;for(var t=x[0],e=0;e<x.length;t=x[++e])c[t]&&delete c[t];s(c,k)}function r(t){window.__onWebMessengerFrameReady__=function(){},A=t,f||(0,l.init)(u);for(var e=x[0],n=0;n<x.length;e=x[++n])c[e]=A[e];if(w){for(var o=w[0],r=0;r<w.length;o=w[++r]){var a;(a=A).on.apply(a,i(o.args))}w=void 0}if(b){var s,h=(s=A).init.apply(s,i(b));b=void 0;for(var d=g[0],m=0;m<g.length;d=g[++m])h="then"===d.type?h.then(d.next):h.catch(d.next);g=[]}}function a(){if(!u){var t=!1;u=document.createElement("iframe"),u.frameBorder=0,u.allowFullscreen=!0,u.allowTransparency=!0,u.className=d.default.ref().locals.iframe,u.onload=function(){if(!t){t=!0,delete u.onload;var e=u.contentWindow.document;e.open(),e.write('\n                    <!DOCTYPE html>\n                    <html>\n                        <head>\n                            <link rel="stylesheet" href="https://cdn.smooch.io/frame.4.5.0.css" type="text/css" />\n                            <script src="https://cdn.smooch.io/frame.4.5.0.min.js" async crossorigin="anonymous"><\/script>\n                        <style>#conversation .logo {display: none;}</style>\n                        </head>\n                        <body>\n                            <div id="mount"></div>\n                        </body>\n                    </html>\n                    '),e.close()}}}f?p&&(p.appendChild(u),p=void 0):document.body.appendChild(u)}Object.defineProperty(e,"__esModule",{value:!0});var s=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t},h=n(5),d=function(t){return t&&t.__esModule?t:{default:t}}(h),m=n(0),l=n(10),c={},A=void 0,u=void 0,f=void 0,p=void 0,g=[],w=[],b=void 0,C=/lebo|awle|pide|obo|rawli|dsbo/i.test(navigator.userAgent),y=/PhantomJS/.test(navigator.userAgent)&&!0,x=["init","login","on","off","logout","sendMessage","updateUser","getConversation","getUser","open","close","isOpened","startConversation"];if(C){var v=document.createElement("a");v.href="https://smooch.io/live-web-chat/?utm_source=widget",v.text="Messaging by smooch.io",(0,m.waitForPage)(function(){document.body.appendChild(v)})}var k={VERSION:"4.5.0",on:function(){for(var t=arguments.length,e=Array(t),n=0;n<t;n++)e[n]=arguments[n];w||(w=[]),w.push({args:e})},init:function(){for(var t=arguments.length,e=Array(t),n=0;n<t;n++)e[n]=arguments[n];b=e,f=e.length>0&&!!e[0].embedded,C||y||(0,m.waitForPage)(function(){a(),d.default.use()});var i={then:function(t){return g.push({type:"then",next:t}),i},catch:function(t){return g.push({type:"catch",next:t}),i}};return i},render:function(t){u?t.appendChild(u):p=t},destroy:function(){A&&(A.destroy(),u.remove(),o())}};o(),e.default=c},function(t,e,n){var i,o=0,r=n(6);"string"==typeof r&&(r=[[t.i,r,""]]),r.locals&&(e.locals=r.locals),e.use=e.ref=function(){return o++||(i=n(8)(r,{insertAt:"bottom"})),e},e.unuse=e.unref=function(){o>0&&!--o&&(i(),i=null)}},function(t,e,n){e=t.exports=n(7)(!0),e.push([t.i,"@keyframes _3FxKeTOOgcsFroUq6se9N7{0%{width:434px;height:664px}to{width:70px;height:90px}}@-webkit-keyframes _3FxKeTOOgcsFroUq6se9N7{0%{width:434px;height:664px}to{width:70px;height:90px}}@keyframes _1GmqPtlICLsWVMg2Kpdx_0{0%{width:374px;height:504px}to{width:70px;height:90px}}@-webkit-keyframes _1GmqPtlICLsWVMg2Kpdx_0{0%{width:374px;height:504px}to{width:70px;height:90px}}@keyframes _36mHeCXpAKdhEsuuD5g8oV{0%{width:354px;height:444px}to{width:70px;height:90px}}@-webkit-keyframes _36mHeCXpAKdhEsuuD5g8oV{0%{width:354px;height:444px}to{width:70px;height:90px}}@keyframes _1ZWQW0p6AI6UGwBFbdBf9M{0%{width:100%;height:100%}to{width:70px;height:90px}}@-webkit-keyframes _1ZWQW0p6AI6UGwBFbdBf9M{0%{width:100%;height:100%}to{width:70px;height:90px}}._2ChX4GFAl1-UBiWknYZyEQ{z-index:9998;border:none;position:fixed}._3fQbteJd3oQu4il3LpMKkX.avcHn2VQJenBvoR5hilPG ._2ChX4GFAl1-UBiWknYZyEQ,.avcHn2VQJenBvoR5hilPG ._2ChX4GFAl1-UBiWknYZyEQ{right:14px;bottom:20px;margin-bottom:-1px;width:70px;height:90px}@media (min-width:1200px) and (min-height:668px){._3fQbteJd3oQu4il3LpMKkX.avcHn2VQJenBvoR5hilPG ._2ChX4GFAl1-UBiWknYZyEQ{-webkit-animation:_3FxKeTOOgcsFroUq6se9N7 .4s cubic-bezier(.62,.28,.23,.99);animation:_3FxKeTOOgcsFroUq6se9N7 .4s cubic-bezier(.62,.28,.23,.99);-webkit-animation-delay:.2s;animation-delay:.2s;-webkit-animation-fill-mode:both;animation-fill-mode:both}}@media (min-width:768px) and (min-height:508px){._3fQbteJd3oQu4il3LpMKkX.avcHn2VQJenBvoR5hilPG ._2ChX4GFAl1-UBiWknYZyEQ{-webkit-animation:_1GmqPtlICLsWVMg2Kpdx_0 .4s cubic-bezier(.62,.28,.23,.99);animation:_1GmqPtlICLsWVMg2Kpdx_0 .4s cubic-bezier(.62,.28,.23,.99);-webkit-animation-delay:.2s;animation-delay:.2s;-webkit-animation-fill-mode:both;animation-fill-mode:both}}@media (min-width:768px) and (max-height:507px){._3fQbteJd3oQu4il3LpMKkX.avcHn2VQJenBvoR5hilPG ._2ChX4GFAl1-UBiWknYZyEQ{-webkit-animation:_36mHeCXpAKdhEsuuD5g8oV .4s cubic-bezier(.62,.28,.23,.99);animation:_36mHeCXpAKdhEsuuD5g8oV .4s cubic-bezier(.62,.28,.23,.99);-webkit-animation-delay:.2s;animation-delay:.2s;-webkit-animation-fill-mode:both;animation-fill-mode:both}}@media (max-width:767px){._3fQbteJd3oQu4il3LpMKkX.avcHn2VQJenBvoR5hilPG ._2ChX4GFAl1-UBiWknYZyEQ{-webkit-animation:_1ZWQW0p6AI6UGwBFbdBf9M .4s cubic-bezier(.62,.28,.23,.99);animation:_1ZWQW0p6AI6UGwBFbdBf9M .4s cubic-bezier(.62,.28,.23,.99);-webkit-animation-delay:0;animation-delay:0;-webkit-animation-fill-mode:both;animation-fill-mode:both}}._3dtqBiGeC8k3yop4A-9Lwm ._2ChX4GFAl1-UBiWknYZyEQ,._3fQbteJd3oQu4il3LpMKkX._3dtqBiGeC8k3yop4A-9Lwm ._2ChX4GFAl1-UBiWknYZyEQ{right:8px;height:56px;bottom:0;transition:height .4s cubic-bezier(.62,.28,.23,.99)}@media (max-width:767px){._3dtqBiGeC8k3yop4A-9Lwm ._2ChX4GFAl1-UBiWknYZyEQ,._3fQbteJd3oQu4il3LpMKkX._3dtqBiGeC8k3yop4A-9Lwm ._2ChX4GFAl1-UBiWknYZyEQ{width:100%}}@media (min-width:768px) and (max-height:507px){._3dtqBiGeC8k3yop4A-9Lwm ._2ChX4GFAl1-UBiWknYZyEQ,._3fQbteJd3oQu4il3LpMKkX._3dtqBiGeC8k3yop4A-9Lwm ._2ChX4GFAl1-UBiWknYZyEQ{width:354px}}@media (min-width:768px) and (min-height:508px){._3dtqBiGeC8k3yop4A-9Lwm ._2ChX4GFAl1-UBiWknYZyEQ,._3fQbteJd3oQu4il3LpMKkX._3dtqBiGeC8k3yop4A-9Lwm ._2ChX4GFAl1-UBiWknYZyEQ{width:374px}}@media (min-width:1200px) and (min-height:668px){._3dtqBiGeC8k3yop4A-9Lwm ._2ChX4GFAl1-UBiWknYZyEQ,._3fQbteJd3oQu4il3LpMKkX._3dtqBiGeC8k3yop4A-9Lwm ._2ChX4GFAl1-UBiWknYZyEQ{width:434px}}@media (max-width:767px){html._2TELtk5nDKlQudVSivRjpt,html._2TELtk5nDKlQudVSivRjpt body{overflow:hidden;position:relative;-webkit-overflow-scrolling:touch;max-height:100%;height:100%;width:100%}}@media (max-width:767px){._2TELtk5nDKlQudVSivRjpt ._2ChX4GFAl1-UBiWknYZyEQ{width:100%;height:100%;right:0;left:0;top:0;bottom:0;max-height:100%}}@media (min-width:768px) and (max-height:507px){._2TELtk5nDKlQudVSivRjpt ._2ChX4GFAl1-UBiWknYZyEQ{width:354px;height:444px}}@media (min-width:768px) and (min-height:508px){._2TELtk5nDKlQudVSivRjpt ._2ChX4GFAl1-UBiWknYZyEQ{width:374px;height:504px}}@media (min-width:1200px) and (min-height:668px){._2TELtk5nDKlQudVSivRjpt ._2ChX4GFAl1-UBiWknYZyEQ{width:434px;height:664px}}._24n-ftZlG3wDvoWFR8zUnn ._2ChX4GFAl1-UBiWknYZyEQ{position:relative;height:100%;width:100%;max-height:100%}","",{version:3,sources:["/root/repo/src/host/stylesheets/animations.less","/root/repo/src/host/stylesheets/iframe.less"],names:[],mappings:"AAAA,mCACI,GACI,YACA,YAAA,CAEJ,GCCA,WACA,WAAA,CAAA,CDGJ,2CACI,GACI,YACA,YAAA,CAEJ,GCTA,WACA,WAAA,CAAA,CDaJ,mCACI,GACI,YACA,YAAA,CAEJ,GCnBA,WACA,WAAA,CAAA,CDuBJ,2CACI,GACI,YACA,YAAA,CAEJ,GC7BA,WACA,WAAA,CAAA,CDiCJ,mCACI,GACI,YACA,YAAA,CAEJ,GCvCA,WACA,WAAA,CAAA,CD2CJ,2CACI,GACI,YACA,YAAA,CAEJ,GCjDA,WACA,WAAA,CAAA,CDqDJ,mCACI,GACI,WACA,WAAA,CAEJ,GC3DA,WACA,WAAA,CAAA,CD+DJ,2CACI,GACI,WACA,WAAA,CAEJ,GCrEA,WACA,WAAA,CAAA,CAGJ,yBAEQ,aACA,YACA,cAAA,CAJR,wHAQQ,WACA,YACA,mBAdJ,WACA,WAAA,CA0BI,iDA0FR,wEAjGY,4EACQ,oEACR,4BACQ,oBACR,iCACQ,wBAAA,CAAA,CAUZ,gDAkFR,wEAzFY,4EACQ,oEACR,4BACQ,oBACR,iCACQ,wBAAA,CAAA,CAUZ,gDA0ER,wEAjFY,4EACQ,oEACR,4BACQ,oBACR,iCACQ,wBAAA,CAAA,CAUhB,yBAkEJ,wEAzEY,4EACQ,oEACR,0BACQ,kBACR,iCACQ,wBAAA,CAAA,CA7CpB,4HAkDQ,UACA,YACA,SACA,mDAAuB,CAKvB,yBAuDR,4HAzDY,UAAA,CAAA,CAKJ,gDAoDR,4HAtDY,WAAA,CAAA,CAKJ,gDAiDR,4HAnDY,WAAA,CAAA,CAKR,iDA8CJ,4HAhDY,WAAA,CAAA,CAcJ,yBAkCR,+DAzCgB,gBACA,kBACA,iCACA,gBACA,YACA,UAAA,CAAA,CAeR,yBAqBR,kDA7BY,WACA,YACA,QACA,OACA,MACA,SACA,eAAA,CAAA,CAMJ,gDAiBR,kDApBY,YACA,YAAA,CAAA,CAMJ,gDAaR,kDAhBY,YACA,YAAA,CAAA,CAMR,iDASJ,kDAZY,YACA,YAAA,CAAA,CAtGZ,kDA2GQ,kBACA,YACA,WACA,eAAA,CAAA",file:"iframe.less",sourcesContent:["@keyframes iframe-button-close-lg {\n    0% {\n        width: @frame-width-lg;\n        height: @frame-height-lg;\n    }\n    100% {\n        .button-size();\n    }\n}\n\n@-webkit-keyframes iframe-button-close-lg {\n    0% {\n        width: @frame-width-lg;\n        height: @frame-height-lg;\n    }\n    100% {\n        .button-size();\n    }\n}\n\n@keyframes iframe-button-close-md {\n    0% {\n        width: @frame-width-md;\n        height: @frame-height-md;\n    }\n    100% {\n        .button-size();\n    }\n}\n\n@-webkit-keyframes iframe-button-close-md {\n    0% {\n        width: @frame-width-md;\n        height: @frame-height-md;\n    }\n    100% {\n        .button-size();\n    }\n}\n\n@keyframes iframe-button-close-sm {\n    0% {\n        width: @frame-width-sm;\n        height: @frame-height-sm;\n    }\n    100% {\n        .button-size();\n    }\n}\n\n@-webkit-keyframes iframe-button-close-sm {\n    0% {\n        width: @frame-width-sm;\n        height: @frame-height-sm;\n    }\n    100% {\n        .button-size();\n    }\n}\n\n@keyframes iframe-button-close-xs {\n    0% {\n        width: @frame-width-xs;\n        height: @frame-height-xs;\n    }\n    100% {\n        .button-size();\n    }\n}\n\n@-webkit-keyframes iframe-button-close-xs {\n    0% {\n        width: @frame-width-xs;\n        height: @frame-height-xs;\n    }\n    100% {\n        .button-size();\n    }\n}\n",'@import "../../shared/stylesheets/bootstrap/mixins.less";\n@import "../../shared/stylesheets/bootstrap/variables.less";\n@import "../../shared/stylesheets/variables.less";\n@import "animations.less";\n\n.button-size() {\n    width: @messenger-button-size + @messenger-button-shadow-width * 2;\n    height: @messenger-button-size + @widget-messenger-button-vertical-spacing + @messenger-button-shadow-width * 2;\n}\n\n:local {\n    .iframe {\n        z-index: 9998; // 1 less than Stripe Checkout\n        border: none;\n        position: fixed;\n    }\n\n    .displayButton .iframe, .widgetClosed.displayButton .iframe {\n        right: @widget-horizontal-spacing - @messenger-button-shadow-width;\n        bottom: @widget-vertical-spacing;\n        margin-bottom: -1px;\n        .button-size();\n    }\n\n    .widgetClosed.displayButton .iframe {\n        @media (min-width: @screen-lg-min) and (min-height: @screen-md-ht-min) {\n            -webkit-animation: iframe-button-close-lg .4s cubic-bezier(.62, .28, .23, .99);\n                    animation: iframe-button-close-lg .4s cubic-bezier(.62, .28, .23, .99);\n            -webkit-animation-delay: .2s;\n                    animation-delay: .2s;\n            -webkit-animation-fill-mode: both;\n                    animation-fill-mode: both;\n        }\n        @media (min-width: @screen-sm-min) and (min-height: @screen-sm-ht-min) {\n            -webkit-animation: iframe-button-close-md .4s cubic-bezier(.62, .28, .23, .99);\n                    animation: iframe-button-close-md .4s cubic-bezier(.62, .28, .23, .99);\n            -webkit-animation-delay: .2s;\n                    animation-delay: .2s;\n            -webkit-animation-fill-mode: both;\n                    animation-fill-mode: both;\n        }\n        @media (min-width: @screen-sm-min) and (max-height: @screen-xs-ht-max) {\n            -webkit-animation: iframe-button-close-sm .4s cubic-bezier(.62, .28, .23, .99);\n                    animation: iframe-button-close-sm .4s cubic-bezier(.62, .28, .23, .99);\n            -webkit-animation-delay: .2s;\n                    animation-delay: .2s;\n            -webkit-animation-fill-mode: both;\n                    animation-fill-mode: both;\n        }\n        @media (max-width: @screen-xs-max) {\n            -webkit-animation: iframe-button-close-xs .4s cubic-bezier(.62, .28, .23, .99);\n                    animation: iframe-button-close-xs .4s cubic-bezier(.62, .28, .23, .99);\n            -webkit-animation-delay: 0;\n                    animation-delay: 0;\n            -webkit-animation-fill-mode: both;\n                    animation-fill-mode: both;\n        }\n    }\n\n    .displayTab .iframe, .widgetClosed.displayTab .iframe {\n        right: @widget-horizontal-spacing - @widget-box-shadow-width;\n        height: @header-height + @widget-box-shadow-width;\n        bottom: 0;\n        transition: height .4s cubic-bezier(.62, .28, .23, .99);\n\n        @media (max-width: @screen-xs-max) {\n            width: @frame-width-xs;\n        }\n        @media (min-width: @screen-sm-min) and (max-height: @screen-xs-ht-max) {\n            width: @frame-width-sm;\n        }\n        @media (min-width: @screen-sm-min) and (min-height: @screen-sm-ht-min) {\n            width: @frame-width-md;\n        }\n        @media (min-width: @screen-lg-min) and (min-height: @screen-md-ht-min) {\n            width: @frame-width-lg;\n        }\n    }\n\n    html.widgetOpened {\n        &, body {\n            @media (max-width: @screen-xs-max) {\n                overflow: hidden;\n                position: relative;\n                -webkit-overflow-scrolling: touch;\n                max-height: 100%;\n                height: 100%;\n                width: 100%;\n            }\n        }\n    }\n\n    .widgetOpened .iframe {\n        @media (max-width: @screen-xs-max) {\n            width: @frame-width-xs;\n            height: @frame-height-xs;\n            right: 0;\n            left: 0;\n            top: 0;\n            bottom: 0;\n            max-height: 100%;\n        }\n        @media (min-width: @screen-sm-min) and (max-height: @screen-xs-ht-max) {\n            width: @frame-width-sm;\n            height: @frame-height-sm;\n        }\n        @media (min-width: @screen-sm-min) and (min-height: @screen-sm-ht-min) {\n            width: @frame-width-md;\n            height: @frame-height-md;\n        }\n        @media (min-width: @screen-lg-min) and (min-height: @screen-md-ht-min) {\n            width: @frame-width-lg;\n            height: @frame-height-lg;\n        }\n    }\n\n    .widgetEmbedded .iframe {\n        position: relative;\n        height: 100%;\n        width: 100%;\n        max-height: 100%;\n    }\n}\n'],sourceRoot:""}]),e.locals={iframe:"_2ChX4GFAl1-UBiWknYZyEQ",displayButton:"avcHn2VQJenBvoR5hilPG",widgetClosed:"_3fQbteJd3oQu4il3LpMKkX","iframe-button-close-lg":"_3FxKeTOOgcsFroUq6se9N7","iframe-button-close-md":"_1GmqPtlICLsWVMg2Kpdx_0","iframe-button-close-sm":"_36mHeCXpAKdhEsuuD5g8oV","iframe-button-close-xs":"_1ZWQW0p6AI6UGwBFbdBf9M",displayTab:"_3dtqBiGeC8k3yop4A-9Lwm",widgetOpened:"_2TELtk5nDKlQudVSivRjpt",widgetEmbedded:"_24n-ftZlG3wDvoWFR8zUnn"}},function(t,e){function n(t,e){var n=t[1]||"",o=t[3];if(!o)return n;if(e&&"function"==typeof btoa){var r=i(o);return[n].concat(o.sources.map(function(t){return"/*# sourceURL="+o.sourceRoot+t+" */"})).concat([r]).join("\n")}return[n].join("\n")}function i(t){return"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(t))))+" */"}t.exports=function(t){var e=[];return e.toString=function(){return this.map(function(e){var i=n(e,t);return e[2]?"@media "+e[2]+"{"+i+"}":i}).join("")},e.i=function(t,n){"string"==typeof t&&(t=[[null,t,""]]);for(var i={},o=0;o<this.length;o++){var r=this[o][0];"number"==typeof r&&(i[r]=!0)}for(o=0;o<t.length;o++){var a=t[o];"number"==typeof a[0]&&i[a[0]]||(n&&!a[2]?a[2]=n:n&&(a[2]="("+a[2]+") and ("+n+")"),e.push(a))}},e}},function(t,e,n){function i(t,e){for(var n=0;n<t.length;n++){var i=t[n],o=u[i.id];if(o){o.refs++;for(var r=0;r<o.parts.length;r++)o.parts[r](i.parts[r]);for(;r<i.parts.length;r++)o.parts.push(m(i.parts[r],e))}else{for(var a=[],r=0;r<i.parts.length;r++)a.push(m(i.parts[r],e));u[i.id]={id:i.id,refs:1,parts:a}}}}function o(t,e){for(var n=[],i={},o=0;o<t.length;o++){var r=t[o],a=e.base?r[0]+e.base:r[0],s=r[1],h=r[2],d=r[3],m={css:s,media:h,sourceMap:d};i[a]?i[a].parts.push(m):n.push(i[a]={id:a,parts:[m]})}return n}function r(t,e){var n=p(t.insertInto);if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var i=b[b.length-1];if("top"===t.insertAt)i?i.nextSibling?n.insertBefore(e,i.nextSibling):n.appendChild(e):n.insertBefore(e,n.firstChild),b.push(e);else{if("bottom"!==t.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");n.appendChild(e)}}function a(t){if(null===t.parentNode)return!1;t.parentNode.removeChild(t);var e=b.indexOf(t);e>=0&&b.splice(e,1)}function s(t){var e=document.createElement("style");return t.attrs.type="text/css",d(e,t.attrs),r(t,e),e}function h(t){var e=document.createElement("link");return t.attrs.type="text/css",t.attrs.rel="stylesheet",d(e,t.attrs),r(t,e),e}function d(t,e){Object.keys(e).forEach(function(n){t.setAttribute(n,e[n])})}function m(t,e){var n,i,o,r;if(e.transform&&t.css){if(!(r=e.transform(t.css)))return function(){};t.css=r}if(e.singleton){var d=w++;n=g||(g=s(e)),i=l.bind(null,n,d,!1),o=l.bind(null,n,d,!0)}else t.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=h(e),i=A.bind(null,n,e),o=function(){a(n),n.href&&URL.revokeObjectURL(n.href)}):(n=s(e),i=c.bind(null,n),o=function(){a(n)});return i(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap)return;i(t=e)}else o()}}function l(t,e,n,i){var o=n?"":i.css;if(t.styleSheet)t.styleSheet.cssText=y(e,o);else{var r=document.createTextNode(o),a=t.childNodes;a[e]&&t.removeChild(a[e]),a.length?t.insertBefore(r,a[e]):t.appendChild(r)}}function c(t,e){var n=e.css,i=e.media;if(i&&t.setAttribute("media",i),t.styleSheet)t.styleSheet.cssText=n;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(n))}}function A(t,e,n){var i=n.css,o=n.sourceMap,r=void 0===e.convertToAbsoluteUrls&&o;(e.convertToAbsoluteUrls||r)&&(i=C(i)),o&&(i+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */");var a=new Blob([i],{type:"text/css"}),s=t.href;t.href=URL.createObjectURL(a),s&&URL.revokeObjectURL(s)}var u={},f=function(t){var e;return function(){return void 0===e&&(e=t.apply(this,arguments)),e}}(function(){return window&&document&&document.all&&!window.atob}),p=function(t){var e={};return function(n){return void 0===e[n]&&(e[n]=t.call(this,n)),e[n]}}(function(t){return document.querySelector(t)}),g=null,w=0,b=[],C=n(9);t.exports=function(t,e){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");e=e||{},e.attrs="object"==typeof e.attrs?e.attrs:{},e.singleton||(e.singleton=f()),e.insertInto||(e.insertInto="head"),e.insertAt||(e.insertAt="bottom");var n=o(t,e);return i(n,e),function(t){for(var r=[],a=0;a<n.length;a++){var s=n[a],h=u[s.id];h.refs--,r.push(h)}if(t){i(o(t,e),e)}for(var a=0;a<r.length;a++){var h=r[a];if(0===h.refs){for(var d=0;d<h.parts.length;d++)h.parts[d]();delete u[h.id]}}}};var y=function(){var t=[];return function(e,n){return t[e]=n,t.filter(Boolean).join("\n")}}()},function(t,e){t.exports=function(t){var e="undefined"!=typeof window&&window.location;if(!e)throw new Error("fixUrls requires window.location");if(!t||"string"!=typeof t)return t;var n=e.protocol+"//"+e.host,i=n+e.pathname.replace(/\/[^\/]*$/,"/");return t.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(t,e){var o=e.trim().replace(/^"(.*)"$/,function(t,e){return e}).replace(/^'(.*)'$/,function(t,e){return e});if(/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(o))return t;var r;return r=0===o.indexOf("//")?o:0===o.indexOf("/")?n+o:i+o.replace(/^\.\//,""),"url("+JSON.stringify(r)+")"})}},function(t,e,n){"use strict";function i(t){for(var e=0;e<h.length;e++)!function(e){var n=h[e],i=a.SCREEN_SIZES[n];"[object Array]"!==Object.prototype.toString.call(i)&&(i=[i]);for(var o=0;o<i.length;o++){var d=i[o];r.default.register((0,s.generateMediaQuery)(d),function(){t.contentWindow.postMessage({type:"sizeChange",value:n},location.protocol+"//"+location.host)})}}(e)}Object.defineProperty(e,"__esModule",{value:!0}),e.init=i;var o=n(11),r=function(t){return t&&t.__esModule?t:{default:t}}(o),a=n(15),s=n(0),h=["lg","md","sm","xs"]},function(t,e,n){var i=n(12);t.exports=new i},function(t,e,n){function i(){if(!window.matchMedia)throw new Error("matchMedia not present, legacy browsers require a polyfill");this.queries={},this.browserIsIncapable=!window.matchMedia("only all").matches}var o=n(13),r=n(1),a=r.each,s=r.isFunction,h=r.isArray;i.prototype={constructor:i,register:function(t,e,n){var i=this.queries,r=n&&this.browserIsIncapable;return i[t]||(i[t]=new o(t,r)),s(e)&&(e={match:e}),h(e)||(e=[e]),a(e,function(e){s(e)&&(e={match:e}),i[t].addHandler(e)}),this},unregister:function(t,e){var n=this.queries[t];return n&&(e?n.removeHandler(e):(n.clear(),delete this.queries[t])),this}},t.exports=i},function(t,e,n){function i(t,e){this.query=t,this.isUnconditional=e,this.handlers=[],this.mql=window.matchMedia(t);var n=this;this.listener=function(t){n.mql=t.currentTarget||t,n.assess()},this.mql.addListener(this.listener)}var o=n(14),r=n(1).each;i.prototype={constuctor:i,addHandler:function(t){var e=new o(t);this.handlers.push(e),this.matches()&&e.on()},removeHandler:function(t){var e=this.handlers;r(e,function(n,i){if(n.equals(t))return n.destroy(),!e.splice(i,1)})},matches:function(){return this.mql.matches||this.isUnconditional},clear:function(){r(this.handlers,function(t){t.destroy()}),this.mql.removeListener(this.listener),this.handlers.length=0},assess:function(){var t=this.matches()?"on":"off";r(this.handlers,function(e){e[t]()})}},t.exports=i},function(t,e){function n(t){this.options=t,!t.deferSetup&&this.setup()}n.prototype={constructor:n,setup:function(){this.options.setup&&this.options.setup(),this.initialised=!0},on:function(){!this.initialised&&this.setup(),this.options.match&&this.options.match()},off:function(){this.options.unmatch&&this.options.unmatch()},destroy:function(){this.options.destroy?this.options.destroy():this.off()},equals:function(t){return this.options===t||this.options.match===t}},t.exports=n},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.SCREEN_SIZES={lg:{minHeight:668,minWidth:1200},md:[{minHeight:508,minWidth:768,maxWidth:1199},{minHeight:508,maxHeight:667,minWidth:768}],sm:{maxHeight:507,minWidth:768},xs:{maxWidth:767}}}]);
</script>
```

then initialize the Web Messenger by placing this snippet towards the end of the `body` section of your page.

```html
<script>
    Smooch.init({appId: '<app-id>'});
</script>
```

### Browserify and Webpack

Install from npm

```
npm install --save smooch
```

Require and init

```javascript
var Smooch = require('smooch');

Smooch.init({appId: '<app-id>'});
```

## Browser support

Web Messenger supports all popular browsers.

#### Desktop versions

- Chrome: Latest and one major version behind
- Edge:  Latest and one major version behind
- Firefox:  Latest and one major version behind
- Internet Explorer: 11+
- Safari:  Latest and one major version behind

#### Mobile versions

- Stock browser on Android 4.1+
- Safari on iOS 8+

#### Other browsers

Web Messenger is likely compatible with other and older browsers but we only test against the versions above.

## API

### Individual functions

#### init(options)
Initializes the Smooch widget in the web page using the specified options. It returns a promise that will resolve when the Web Messenger is ready. Note that except`on` and `off`, all methods needs to be called after a successful `init`.

##### Options

| Option | Optional? | Default value | Description |
| --- | --- | --- | --- |
| appId | No | - | Your app id |
| jwt | Yes | - | Token to authenticate your communication with the server (see http://docs.smooch.io/javascript/#authenticating-users-optional)
| userId | Yes | - | User's id |
| authCode | Yes | - | An auth code for linking to an existing conversation (see more details [here](https://docs.smooch.io/rest/#get-auth-code))|
| locale | Yes | `en-US` | Locale used for date formatting using the `<language>-<COUNTRY>` format. Language codes can be found [here](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) and country codes [here](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2). <br /> **Note 1 : ** The country part is optional, and if a country is either not recognized or supported, it will fallback to using the generic language. If the language isn't supported, it will fallback to `en-US`. <br /> **Note 2:** this is *only* used for date formatting and doesn't provide built-in translations for Web Messenger. Refer to the [documentation](https://docs.smooch.io/guide/web-messenger/#strings-customization) for how to handle translations. |
| soundNotificationEnabled | Yes | `true` | Enables the sound notification for new messages |
| imageUploadEnabled | Yes | `true` | Enables the image upload feature. |
| embedded | Yes | False | Tells the widget it will be embedded. (see Embedded section below) |
| customText | Yes | See the example below | Strings used in the widget UI. You can use these to either customize the text or translate it. If something is between `{}`, it's a variable and needs to stay in your customized text if you want to use it. |

```javascript
var skPromise = Smooch.init({
    appId: '<app-id>',
    // For authenticated mode
    jwt: 'your_jwt',
    userId: 'user_id',
    locale: 'en-US',
    customText: {
        actionPaymentCompleted: 'Payment Completed',
        actionPaymentError: 'An error occurred while processing the card. <br> Please try again or use a different card.',
        actionPostbackError: 'An error occurred while processing your action. Please try again.',
        clickToRetry: 'Message not delivered. Click to retry.',
        connectNotificationText: 'Be notified inside your other apps when you get a reply.',
        connectNotificationSingleText: 'Be notified when you get a reply.',
        connectNotificationSingleButtonText: 'Turn on <name> notifications',
        connectNotificationOthersText: 'others',
        conversationTimestampHeaderFormat: 'MMMM D YYYY, h:mm A',
        emailChangeAddress: 'Change my email',
        emailDescription: 'To be notified by email when you get a reply, enter your email address.',
        emailFieldLabel: 'Your email',
        emailFieldPlaceholder: 'Your email address',
        emailFormButton: 'Continue',
        fetchHistory: 'Load more',
        fetchingHistory: 'Retrieving history...',
        frontendEmailChannelDescription: 'To talk to us using email just send a message to our email address and we\'ll reply shortly:',
        headerText: 'How can we help?',
        inputPlaceholder: 'Type a message...',
        introAppText: 'Message us below or from your favorite app.',
        introductionText: 'We\'re here to talk, so ask us anything!',
        invalidFileError: 'Only images are supported. Choose a file with a supported extension (jpg, jpeg, png, gif, or bmp).',
        lineChannelDescription: 'To talk to us using LINE, scan this QR code using the LINE app and send us a message.',
        locationNotSupported: 'Your browser does not support location services or it’s been disabled. Please type your location instead.',
        locationSecurityRestriction: 'This website cannot access your location. Please type your location instead.',
        locationSendingFailed: 'Could not send location',
        locationServicesDenied: 'This website cannot access your location. Allow access in your settings or type your location instead.',
        messageError: 'An error occured while sending your message. Please try again.',
        messageIndicatorTitlePlural: '({count}) New messages',
        messageIndicatorTitleSingular: '({count}) New message',
        messageRelativeTimeDay: '{value}d ago',
        messageRelativeTimeHour: '{value}h ago',
        messageRelativeTimeJustNow: 'Just now',
        messageRelativeTimeMinute: '{value}m ago',
        messageTimestampFormat: 'h:mm A',
        messageSending: 'Sending...',
        messageDelivered: 'Delivered',
        messengerChannelDescription: 'Connect your Facebook Messenger account to be notified when you get a reply and carry the conversation on Facebook Messenger.',
        notificationSettingsChannelsDescription: 'You can also talk to us from your favorite app or service.',
        notificationSettingsChannelsTitle: 'Other Channels',
        notificationSettingsConnected: 'Connected',
        notificationSettingsConnectedAs: 'Connected as {username}',
        sendButtonText: 'Send',
        settingsHeaderText: 'Settings',
        smsBadRequestError: 'We were unable to communicate with this number. Try again or use a different one.',
        smsCancel: 'Cancel',
        smsChangeNumber: 'Change my number',
        smsChannelDescription: 'Connect your SMS number to be notified when you get a reply and carry the conversation over SMS.',
        smsChannelPendingDescription: 'Check your messages at {number} to confirm your phone number.',
        smsContinue: 'Continue',
        smsInvalidNumberError: 'Your phone number isn\'t valid. Please try again.',
        smsLinkCancelled: 'Link to {appUserNumber} was cancelled.',
        smsLinkPending: 'Pending',
        smsPingChannelError: 'There was an error sending a message to your number.',
        smsSendText: 'Send me a text',
        smsStartTexting: 'Start Texting',
        smsTooManyRequestsError: 'A connection for that number was requested recently. Please try again in {minutes} minutes.',
        smsTooManyRequestsOneMinuteError: 'A connection for that number was requested recently. Please try again in 1 minute.',
        smsUnhandledError: 'Something went wrong. Please try again.',
        tapToRetry: 'Message not delivered. Tap to retry.',
        telegramChannelDescription: 'Connect your Telegram account to be notified when you get a reply and carry the conversation on Telegram',
        unsupportedMessageType: 'Unsupported message type.',
        unsupportedActionType: 'Unsupported action type.',
        linkError: 'An error occurred when attempting to generate a link for this channel. Please try again.',
        viberChannelDescription: 'Connect your Viber account to be notified when you get a reply and carry the conversation on Viber. To get started, scan the QR code using the Viber app.',
        viberChannelDescriptionMobile: 'Connect your Viber account to be notified when you get a reply and carry the conversation on Viber. To get started, install the Viber app and tap Connect.',
        viberQRCodeError: 'An error occurred while fetching your Viber QR code. Please try again.',
        wechatChannelDescription: 'Connect your WeChat account to be notified when you get a reply and carry the conversation on WeChat. To get started, scan this QR code using the WeChat app.',
        wechatChannelDescriptionMobile: 'Connect your WeChat account to be notified when you get a reply and carry the conversation on WeChat. To get started, save this QR code image and upload it in the <a href=\'weixin://dl/scan\'>QR code scanner</a>.',
        wechatQRCodeError: 'An error occurred while fetching your WeChat QR code. Please try again.'
    }
});


skPromise.then(function() {
    // do something
});

// pass it around...

skPromise.then(function() {
    //do something else
});

```

#### open()
Opens the conversation widget (noop when embedded)

```javascript
Smooch.open();
```

#### close()
Closes the conversation widget (noop when embedded)

```javascript
Smooch.close();
```

#### isOpened()
Tells if the widget is currently opened or closed.

```javascript
Smooch.isOpened();
```

#### login(userId , jwt)
Logs a user in the Web Messenger, retrieving the conversation the user already had on other browsers and/or devices. Note that you don't need to call this after `init` if you passed the user id and jwt already, it's done internally. This returns a promise that resolves when the Web Messenger is ready again.

```
Smooch.login('some-id', 'some-jwt');
```

#### logout()
Logs out the current user and reinitialize the widget with an anonymous user. This returns a promise that resolves when the Web Messenger is ready again.

```
Smooch.logout();
```

#### destroy()
Destroys the Web Messenger and makes it disappear. The Web Messenger has to be reinitialized with `init` to be working again because it also clears up the app id from the Web Messenger. It will also unbind all listeners you might have with `Smooch.on`.

```
Smooch.destroy();
```

#### sendMessage(message)
Sends a message on the user's behalf

```javascript
Smooch.sendMessage({
    type: 'text',
    text: 'hello'
});

// OR

Smooch.sendMessage('hello');
```

#### updateUser(user)
Updates user information

```javascript
Smooch.updateUser({
    givenName: 'Updated',
    surname: 'Name',
    email: 'updated@email.com',
    properties: {
      'justGotUpdated': true
    }
});
```

#### getUser()
Returns the current user.

```javascript
var user = Smooch.getUser()
```

#### getConversation()
Returns the conversation if it exists

```javascript
var conversation = Smooch.getConversation();
```

#### startConversation()
Creates a user and conversation on the server, allowing the business to reach out proactively to the user via the public API.

Creating a conversation via this method will count as an active user conversation (AUC) whether messages are exchanged or not, which may incur cost based on your plan. It is strongly recommended to only call this method in the case where a message is likely to be sent.

This method is called automatically when starting a conversation via the `sendMessage` method, or when a user sends a message via the conversation view.

If a conversation already exists for the current user, this call is a no-op.

```javascript
Smooch.startConversation();
```

### Events
If you want to make sure your events are triggered, try to bind them before calling `Smooch.init`.

To bind an event, use `Smooch.on(<event name>, <handler>);`. To unbind events, you can either call `Smooch.off(<event name>, handler)` to remove one specific handler, call `Smooch.off(<event name>)` to remove all handlers for an event, or call `Smooch.off()` to unbind all handlers.

#### ready
```
// This event triggers when init completes successfully... Be sure to bind before calling init!
Smooch.on('ready', function(){
    console.log('the init has completed!');
});

Smooch.init(...);
```

#### destroy
```
// This event triggers when the widget is destroyed.
Smooch.on('destroy', function(){
    console.log('the widget is destroyed!');
});

Smooch.destroy();
```

#### message:received
```
// This event triggers when the user receives a message
Smooch.on('message:received', function(message) {
    console.log('the user received a message', message);
});
```

#### message:sent
```
// This event triggers when the user sends a message
Smooch.on('message:sent', function(message) {
    console.log('the user sent a message', message);
});
```

#### message
```
// This event triggers when a message was added to the conversation
Smooch.on('message', function(message) {
    console.log('a message was added to the conversation', message);
});
```

#### unreadCount
```
// This event triggers when the number of unread messages changes
Smooch.on('unreadCount', function(unreadCount) {
    console.log('the number of unread messages was updated', unreadCount);
});
```

#### widget:opened
```
// This event triggers when the widget is opened
Smooch.on('widget:opened', function() {
    console.log('Widget is opened!');
});
```

#### widget:closed
```
// This event triggers when the widget is closed
Smooch.on('widget:closed', function() {
    console.log('Widget is closed!');
});
```

### Embedded mode
As describe above, to activate the embedded mode, you need to pass `embedded: true` when calling `Smooch.init`. By doing so, you are disabling the auto-rendering mechanism and you will need to call `Smooch.render` manually. This method accepts a DOM element which will be used as the container where the widget will be rendered.

The embedded widget will take full width and height of the container. You must give it a height, otherwise, the widget will collapse.

## Acknowledgements

https://github.com/lipis/flag-icon-css
