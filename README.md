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
    !function(e){function t(o){if(n[o])return n[o].exports;var i=n[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="https://cdn.smooch.io/",t(t.s=313)}({10:function(e,t){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(n=window)}e.exports=n},117:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.IFRAME_ID="web-messenger-container"},142:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.SCREEN_SIZES={lg:{minHeight:668,minWidth:1200},md:[{minHeight:508,minWidth:768,maxWidth:1199},{minHeight:508,maxHeight:667,minWidth:768}],sm:{maxHeight:507,minWidth:768},xs:{maxWidth:767}}},213:function(e,t,n){"use strict";function o(e){"complete"!==document.readyState&&"loaded"!==document.readyState&&"interactive"!==document.readyState||!document.body?document.addEventListener("DOMContentLoaded",function(){e()}):e()}function i(e){var t=["screen"];return e.minHeight&&t.push("(min-height: "+e.minHeight+"px)"),e.maxHeight&&t.push("(max-height: "+e.maxHeight+"px)"),e.minWidth&&t.push("(min-width: "+e.minWidth+"px)"),e.maxWidth&&t.push("(max-width: "+e.maxWidth+"px)"),t.join(" and ")}Object.defineProperty(t,"__esModule",{value:!0}),t.waitForPage=o,t.generateMediaQuery=i},214:function(e,t){function n(e,t){var n=0,o=e.length;for(n;n<o&&!1!==t(e[n],n);n++);}function o(e){return"[object Array]"===Object.prototype.toString.apply(e)}function i(e){return"function"==typeof e}e.exports={isFunction:i,isArray:o,each:n}},313:function(e,t,n){"use strict";(function(e){var t=n(314),o=n(117);document.getElementById(o.IFRAME_ID)||((0,t.setUp)(),window.__onWebMessengerHostReady__?window.__onWebMessengerHostReady__(t.WebMessenger):e.Smooch=t.WebMessenger)}).call(t,n(10))},314:function(e,t,n){"use strict";function o(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}function i(){if(!document.getElementById(p.IFRAME_ID)){g=void 0,v=void 0,window.__onWebMessengerFrameReady__=s;for(var e=E[0],t=0;t<E.length;e=E[++t])m[e]&&delete m[e];c(m,O)}}function r(){var e=document.createElement("link");e.rel="stylesheet",e.type="text/css",e.href="https://cdn.smooch.io/smooch.4.20.0.css",document.body.appendChild(e)}function s(e){window.__onWebMessengerFrameReady__=function(){},g=e,y||f.init(v);for(var t=E[0],n=0;n<E.length;t=E[++n])m[t]=g[t];if(_){for(var i=_[0],r=0;r<_.length;i=_[++r]){var s;(s=g).on.apply(s,o(i.args))}_=void 0}if(x){var a,c=(a=g).init.apply(a,o(x));x=void 0;for(var u=w[0],d=0;d<w.length;u=w[++d])c="then"===u.type?c.then(u.next):c.catch(u.next);w=[]}}function a(){if(!v){var e=null,t=!1;v=document.createElement("iframe"),v.id=p.IFRAME_ID,v.frameBorder=0,v.allowFullscreen=!0,v.allowTransparency=!0,v.scrolling="no",v.className=d.default.iframe;var n=function(){t=!0,clearInterval(e),delete v.onload;var n=I(v);n.open(),n.write('\n                    <!DOCTYPE html>\n                    <html>\n                        <head>\n                            \n                            <link rel="stylesheet" href="https://cdn.smooch.io/frame.4.20.0.css" type="text/css" />\n                            <script src="https://cdn.smooch.io/frame.4.20.0.min.js" async crossorigin="anonymous"><\/script>\n                        <style>#conversation .logo {display: none;}</style>\n                        </head>\n                        <body>\n                            <div id="mount"></div>\n                        </body>\n                    </html>\n                    '),n.close()};e=setInterval(function(){var e=I(v);t||!e||"complete"!=e.readyState&&"interactive"!=e.readyState||n()},1e3),v.onload=function(){t||n()}}y?b&&(b.appendChild(v),b=void 0):document.body.appendChild(v)}Object.defineProperty(t,"__esModule",{value:!0}),t.WebMessenger=void 0;var c=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e};t.setUp=i;var u=n(315),d=function(e){return e&&e.__esModule?e:{default:e}}(u),l=n(213),h=n(317),f=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(h),p=n(117),m=t.WebMessenger={},g=void 0,v=void 0,y=void 0,b=void 0,w=[],_=[],x=void 0,M=/lebo|awle|pide|obo|rawli|dsbo/i.test(navigator.userAgent),W=/PhantomJS/.test(navigator.userAgent)&&!0,E=["init","login","on","off","logout","sendMessage","triggerPostback","updateUser","getConversation","getUser","open","close","isOpened","startConversation","setDelegate","markAllAsRead","notificationChannelPromptEnabled","setPredefinedMessage","startTyping","stopTyping"];if(M){var A=document.createElement("a");A.href="https://smooch.io/live-web-chat/?utm_source=widget",A.text="We run on Smooch by Zendesk",(0,l.waitForPage)(function(){document.body.appendChild(A)})}var O={VERSION:"4.20.0",on:function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];_||(_=[]),_.push({args:t})},init:function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];x=t,y=t.length>0&&!!t[0].embedded,M||W||(0,l.waitForPage)(function(){r(),a()});var o={then:function(e){return w.push({type:"then",next:e}),o},catch:function(e){return w.push({type:"catch",next:e}),o}};return o},render:function(e){v?e.appendChild(v):b=e},destroy:function(){g&&(g.destroy(),v.remove?v.remove():v.parentNode.removeChild(v),f.unregister(),i())}},I=function(e){return e.contentWindow&&e.contentWindow.document}},315:function(e,t){e.exports={iframe:"_2ChX4GFAl1-UBiWknYZyEQ",displayButton:"avcHn2VQJenBvoR5hilPG",widgetClosed:"_3fQbteJd3oQu4il3LpMKkX","iframe-button-close-lg":"_3FxKeTOOgcsFroUq6se9N7","iframe-button-close-md":"_1GmqPtlICLsWVMg2Kpdx_0","iframe-button-close-sm":"_36mHeCXpAKdhEsuuD5g8oV","iframe-button-close-xs":"_1ZWQW0p6AI6UGwBFbdBf9M",displayTab:"_3dtqBiGeC8k3yop4A-9Lwm",widgetOpened:"_2TELtk5nDKlQudVSivRjpt",widgetEmbedded:"_24n-ftZlG3wDvoWFR8zUnn"}},317:function(e,t,n){"use strict";function o(e){for(var t=0;t<d.length;t++){var n=d[t],o=c.SCREEN_SIZES[n];"[object Array]"!==Object.prototype.toString.call(o)&&(o=[o]);for(var i=0;i<o.length;i++){e({rule:o[i],size:n})}}}function i(e){o(function(t){var n=t.rule,o=t.size;a.default.register((0,u.generateMediaQuery)(n),function(){e.contentWindow.postMessage({type:"sizeChange",value:o},location.protocol+"//"+location.host)})})}function r(){o(function(e){var t=e.rule;a.default.unregister((0,u.generateMediaQuery)(t))})}Object.defineProperty(t,"__esModule",{value:!0}),t.init=i,t.unregister=r;var s=n(318),a=function(e){return e&&e.__esModule?e:{default:e}}(s),c=n(142),u=n(213),d=["lg","md","sm","xs"]},318:function(e,t,n){var o=n(319);e.exports=new o},319:function(e,t,n){function o(){if(!window.matchMedia)throw new Error("matchMedia not present, legacy browsers require a polyfill");this.queries={},this.browserIsIncapable=!window.matchMedia("only all").matches}var i=n(320),r=n(214),s=r.each,a=r.isFunction,c=r.isArray;o.prototype={constructor:o,register:function(e,t,n){var o=this.queries,r=n&&this.browserIsIncapable;return o[e]||(o[e]=new i(e,r)),a(t)&&(t={match:t}),c(t)||(t=[t]),s(t,function(t){a(t)&&(t={match:t}),o[e].addHandler(t)}),this},unregister:function(e,t){var n=this.queries[e];return n&&(t?n.removeHandler(t):(n.clear(),delete this.queries[e])),this}},e.exports=o},320:function(e,t,n){function o(e,t){this.query=e,this.isUnconditional=t,this.handlers=[],this.mql=window.matchMedia(e);var n=this;this.listener=function(e){n.mql=e.currentTarget||e,n.assess()},this.mql.addListener(this.listener)}var i=n(321),r=n(214).each;o.prototype={constuctor:o,addHandler:function(e){var t=new i(e);this.handlers.push(t),this.matches()&&t.on()},removeHandler:function(e){var t=this.handlers;r(t,function(n,o){if(n.equals(e))return n.destroy(),!t.splice(o,1)})},matches:function(){return this.mql.matches||this.isUnconditional},clear:function(){r(this.handlers,function(e){e.destroy()}),this.mql.removeListener(this.listener),this.handlers.length=0},assess:function(){var e=this.matches()?"on":"off";r(this.handlers,function(t){t[e]()})}},e.exports=o},321:function(e,t){function n(e){this.options=e,!e.deferSetup&&this.setup()}n.prototype={constructor:n,setup:function(){this.options.setup&&this.options.setup(),this.initialised=!0},on:function(){!this.initialised&&this.setup(),this.options.match&&this.options.match()},off:function(){this.options.unmatch&&this.options.unmatch()},destroy:function(){this.options.destroy?this.options.destroy():this.off()},equals:function(e){return this.options===e||this.options.match===e}},e.exports=n}});
</script>
```

then initialize the Web Messenger by placing this snippet towards the end of the `body` section of your page.

```html
<script>
    Smooch.init({appId: '<app-id>'}).then(function() {
        // Your code after init is complete
    });
    
    // For okkami.js
    Okkami.init('<app-id>');

    // PrechatCapture and Form
    // https://docs.smooch.io/guide/web-messenger/#custom-prechat-capture
      var prechatCapture = {
        enabled: true,
        fields: [
          {
            type: 'text',
            name: 'user_name', // Core use it for detect user name.
            label: 'Your Name'
          },
          {
            type: 'email',
            name: 'email',
            label: 'Your email'
          },
          {
            type: 'select',
            name: 'property',
            label: 'Select Destination',
            options: [
              {
                name: '[property.id]',
                label: '[property.name]'
              },
              {
                name: '[property.id]',
                label: '[property.name]'
              }
            ]
          }
        ]
      };

      // https://github.com/smooch/smooch-web#customtext
      var customText = {
        prechatCaptureGreetingText: 'Please fill in your name.'
      };

      Okkami.init('<app-id>', prechatCapture, customText);
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

Smooch.init({appId: '<app-id>'}).then(function() {
    // Your code after init is complete
});
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
Initializes the Smooch widget in the web page using the specified options. It returns a promise that will resolve when the Web Messenger is ready. Note that except `on` and `off`, all methods needs to be called after a successful `init`.

##### Options

| Option | Optional? | Default value | Description |
| --- | --- | --- | --- |
| appId | No | - | Your app id |
| userId | Yes | - | Optional. User's id, which can be passed in `init()` as an alternative to `login()` (see [below](#authenticating-the-user-init-vs-login)) |
| jwt | Yes | - | Optional. User's authentication token, which can be passed in `init()` as an alternative to `login()` (see [below](#authenticating-the-user-init-vs-login)) |
| authCode | Yes | - | An auth code for linking to an existing conversation (see more details [here](https://docs.smooch.io/rest/#get-auth-code))|
| locale | Yes | `en-US` | Locale used for date formatting using the `<language>-<COUNTRY>` format. Language codes can be found [here](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) and country codes [here](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2). <br /> **Note 1 : ** The country part is optional, and if a country is either not recognized or supported, it will fallback to using the generic language. If the language isn't supported, it will fallback to `en-US`. <br /> **Note 2:** this is *only* used for date formatting and doesn't provide built-in translations for Web Messenger. Refer to the [documentation](https://docs.smooch.io/guide/web-messenger/#strings-customization) for how to handle translations. |
| soundNotificationEnabled | Yes | `true` | Enables the sound notification for new messages |
| imageUploadEnabled | Yes | `true` | Enables the image upload feature. (deprecated: use menuItems.imageUpload; if this option is `false`, it will disable `menuItems.imageUpload` and `menuItems.fileUpload`) |
| fixedIntroPane | Yes | `false` | When enabled, the introduction pane will be pinned at the top of the conversation instead of scrolling with it. |
| embedded | Yes | False | Tells the widget it will be embedded. (see Embedded section below) |
| displayStyle | Yes | `button` | Choose how the messenger will appear on your website. Must be either `button` or `tab`.
| buttonIconUrl | Yes | - | When the `displayStyle` is `button`, you have the option of selecting your own button icon. The image must be at least 200 x 200 pixels and must be in either JPG, PNG, or GIF format.
| buttonWidth | Yes | `58px` | When the `displayStyle` is `button`, you have the option of specifying the button width.
| buttonHeight | Yes | `58px` | When the `displayStyle` is `button`, you have the option of specifying the button height.
| businessName | Yes | - | A custom business name.
| businessIconUrl | Yes | - | A custom business icon url. The image must be at least 200 x 200 pixels and must be in either JPG, PNG, or GIF format.
| backgroundImageUrl | Yes | - | A background image url for the conversation. Image will be tiled to fit the window.
| integrationOrder | Yes | - | Array of integration IDs. When set, only integrations from this list will be displayed. If an empty array is used, no integrations will be displayed. *Note*: Listing an integration in the array doesn't guarantee that it will be displayed in the Web Messenger.
| customColors | Yes | [See below.](#customcolors) | Colors used in the Web Messenger UI. |
| customText | Yes | See the example below | Strings used in the Web Messenger UI. You can use these to either customize the text or translate it. *Note*: Some strings include variables (surrounded by `{}`) which must remain in your customized text. |
| menuItems | Yes | [See below.](#menuitems) | Choose menu items. |
| notificationChannelPromptEnabled | Yes | `true` | Enables displaying a prompt to new users after their first message to suggest linking their chat instance with their other 3rd-party apps. |
| browserStorage | Yes | `localStorage` | Choose the storage type to use for storing user identity in the browser. Must be either `localStorage` or `sessionStorage`. [Learn more](https://docs.smooch.io/guide/web-messenger/#browser-storage) |
| delegate | Yes | `undefined` |  Sets a delegate on the conversation. See the [delegate](#delegate) section for more details. |
| prechatCapture | Yes | [See below.](#prechatcapture) | Enables automatically capturing a user's name and email via a form before the start of a conversation. Disables the chat input until the form has been submitted. |

##### `customColors`


| Option            | Optional? | Default value | Description                                                                                                                           |
| ----------------- | --------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| brandColor        | Yes       | `65758e`      | This color will be used in the messenger header and the button or tab in idle state. Must be a 3 or 6-character hexadecimal color.    |
| conversationColor | Yes       | `0099ff`      | This color will be used for customer messages, quick replies and actions in the footer. Must be a 3 or 6-character hexadecimal color. |
| actionColor       | Yes       | `0099ff`      | This color will be used for call-to-actions inside your messages. Must be a 3 or 6-character hexadecimal color.                       |

##### `customText`
The list of localizable strings. These strings can be modified. _If an option is not given a custom string, the default value will be used._

| Option | Default value |
| ------ | ------------- |
| actionPaymentCompleted | Payment Completed |
| actionPaymentError | An error occurred while processing the card. `<br>` Please try again or use a different card. |
| actionPostbackError | An error occurred while processing your action. Please try again. |
| clickToRetry | Message not delivered. Click to retry. |
| clickToRetryForm | Form not submitted. Click anywhere on the form to retry. |
| connectNotificationText | Give us a way to reach out: |
| connectNotificationSingleText | Be notified when you get a reply. |
| connectNotificationSingleButtonText | Turn on `<name>` notifications |
| connectNotificationOthersText | others |
| conversationTimestampHeaderFormat | MMMM D YYYY, h:mm A |
| couldNotConnect | Couldn't connect. You can {retry}. |
| couldNotConnectInner | retry connecting now |
| couldNotConnectWithRetry | Couldn't connect. We'll keep retrying, or you can {retry}. |
| couldNotConnectWithRetryInner | try now |
| emailChangeAddress | Change my email |
| emailDescription | To be notified by email when you get a reply, enter your email address. |
| emailFieldLabel | Your email |
| emailFieldPlaceholder | Your email address |
| emailFormButton | Continue |
| fetchHistory | Load more |
| fetchingHistory | Retrieving history... |
| fileTooLargeError | Max file size limit exceeded ({size}) |
| fileTypeError | Unsupported file type. |
| formErrorInvalidEmail | Email is invalid |
| formErrorNoLongerThan | Must contain no more than ({characters}) characters |
| formErrorNoShorterThan | Must contain at least ({characters}) characters |
| formErrorUnknown | This doesn't look quite right |
| formFieldSelectPlaceholderFallback | Choose one... |
| frontendEmailChannelDescription | To talk to us using email just send a message to our email address and we\'ll reply shortly: |
| headerText | How can we help? |
| imageClickToReload | Click to reload image. |
| imageClickToView | Click to view {size} image. |
| imagePreviewNotAvailable | Preview not available. |
| inputPlaceholder | Type a message... |
| inputPlaceholderBlocked | Complete the form above... |
| introAppText | Message us below or from your favorite app. |
| introductionText | We\'re here to talk, so ask us anything! |
| invalidFileError | Only images are supported. Choose a file with a supported extension (jpg, jpeg, png, gif, or bmp). |
| lineChannelDescription | To talk to us using LINE, scan this QR code using the LINE app and send us a message. |
| linkError | An error occurred when attempting to generate a link for this channel. Please try again. |
| locationNotSupported | Your browser does not support location services or it’s been disabled. Please type your location instead. |
| locationSecurityRestriction | This website cannot access your location. Please type your location instead. |
| locationSendingFailed | Could not send location |
| locationServicesDenied | This website cannot access your location. Allow access in your settings or type your location instead. |
| messageError | An error occured while sending your message. Please try again. |
| messageIndicatorTitlePlural | (`{count}`) New messages |
| messageIndicatorTitleSingular | (`{count}`) New message |
| messageRelativeTimeDay | `{value}`d ago |
| messageRelativeTimeHour | `{value}`h ago |
| messageRelativeTimeJustNow | Just now |
| messageRelativeTimeMinute | `{value}`m ago |
| messageTimestampFormat | h:mm A |
| messageSending | Sending... |
| messageDelivered | Delivered |
| messengerChannelDescription | Connect your Facebook Messenger account to be notified when you get a reply and continue the conversation on Facebook Messenger. |
| notificationSettingsChannelsDescription | You can also talk to us from your favorite app or service. |
| notificationSettingsChannelsTitle | Other Channels |
| notificationSettingsConnected | Connected |
| notificationSettingsConnectedAs | Connected as `{username}` |
| prechatCaptureGreetingText | Hi there 👋\nTo start off, we\'d like to know a little bit more about you: |
| prechatCaptureNameLabel | Your name |
| prechatCaptureNamePlaceholder | Type your name... |
| prechatCaptureEmailLabel | Email |
| prechatCaptureEmailPlaceholder | name@company.com |
| prechatCaptureConfirmationText | Thanks for that! What can we help you with? |
| prechatCaptureMailgunLinkingConfirmation | You\'ll be notified here and by email at {email} once we reply. |
| sendButtonText | Send |
| settingsHeaderText | Settings |
| shareLocation | Share location |
| smsBadRequestError | We were unable to communicate with this number. Try again or use a different one. |
| smsCancel | Cancel |
| smsChangeNumber | Change my number |
| smsChannelDescription | Connect your SMS number to be notified when you get a reply and continue the conversation over SMS. |
| smsChannelPendingDescription | Check your messages at `{number}` to confirm your phone number. |
| smsContinue | Continue |
| smsInvalidNumberError | Your phone number isn\'t valid. Please try again. |
| smsLinkCancelled | Link to `{appUserNumber}` was cancelled. |
| smsLinkPending | Pending |
| smsPingChannelError | There was an error sending a message to your number. |
| smsSendText | Send me a text |
| smsStartTexting | Start Texting |
| smsTooManyRequestsError | A connection for that number was requested recently. Please try again in {minutes} minutes. |
| smsTooManyRequestsOneMinuteError | A connection for that number was requested recently. Please try again in 1 minute. |
| smsUnhandledError | Something went wrong. Please try again. |
| tapToRetry | Message not delivered. Tap to retry. |
| tapToRetryForm | Form not submitted. Tap anywhere on the form to retry. |
| telegramChannelDescription | Connect your Telegram account to be notified when you get a reply and continue the conversation on Telegram |
| unsupportedMessageType | Unsupported message type. |
| unsupportedActionType | Unsupported action type. |
| uploadDocument | Upload document. |
| uploadInvalidError | Invalid file. |
| uploadPhoto | Upload photo. |
| uploadVirusError | A virus was detected in your file and it has been rejected |
| viberChannelDescription | Connect your Viber account to be notified when you get a reply and continue the conversation on Viber. To get started, scan the QR code using the Viber app. |
| viberChannelDescriptionMobile | Connect your Viber account to be notified when you get a reply and continue the conversation on Viber. To get started, install the Viber app and tap Connect. |
| viberQRCodeError | An error occurred while fetching your Viber QR code. Please try again. |
| wechatChannelDescription | Connect your WeChat account to be notified when you get a reply and continue the conversation on WeChat. To get started, scan this QR code using the WeChat app. |
| wechatChannelDescriptionMobile | Connect your WeChat account to be notified when you get a reply and continue the conversation on WeChat. To get started, save this QR code image and upload it `<a href=\'weixin://dl/scan\'>`QR code scanner`</a>`. |
| wechatQRCodeError | An error occurred while fetching your WeChat QR code. Please try again. |

[See below](#example) for an example.

##### `menuItems`


| Option        | Optional? | Default value | Description                            |
| ------------- | --------- | ------------- | -------------------------------------- |
| imageUpload   | Yes       | `true`        | Enables the image upload menu item.    |
| fileUpload    | Yes       | `true`        | Enables the file upload menu item.     |
| shareLocation | Yes       | `true`        | Enables the share location menu item.  |

[See below](#example) for an example.

##### `prechatCapture`

| Option             | Optional? | Default value | Description                                                                                                                                                                       |
| ------------------ | --------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enabled            | Yes       | `false`       | Enables the prechat capture experience.                                                                                                                                           |
| enableEmailLinking | Yes       | `true`        | Automatically links the user's email to the app's Mailgun integration if it exists. If the property `fields` is defined, the first field of type `email` will be used.            |
| fields             | Yes       | -             | Overrides the default Prechat Capture [fields](https://docs.smooch.io/rest/#field) to define a [custom form](https://docs.smooch.io/guide/web-messenger/#custom-prechat-capture). |

[See below](#example) for an example.

`prechatCapture` uses the following [`customText`](#customText) options:

| Option                                   | Description                                                                   |
| ---------------------------------------- | ----------------------------------------------------------------------------- |
| prechatCaptureGreetingText               | Text for the initial greeting message.                                        |
| prechatCaptureNameLabel                  | Label displayed for the default form's first field.                           |
| prechatCaptureNamePlaceholder            | Placeholder for the default form's first field.                               |
| prechatCaptureEmailLabel                 | Label displayed for the default form's second field.                          |
| prechatCaptureEmailPlaceholder           | Placeholder for the default form's second field.                              |
| prechatCaptureConfirmationText           | Text for the confirmation message sent when the form is completed.            |
| prechatCaptureMailgunLinkingConfirmation | Text for the notification message when a user has linked their email address. |

##### Example

```javascript
var skPromise = Smooch.init({
    appId: '<app-id>',
    // For authenticated mode
    jwt: 'your_jwt',
    userId: 'user_id',
    locale: 'en-US',

    customColors: {
        brandColor: '65758e',
        conversationColor: '65758e',
        actionColor: '65758e',
    },

    menuItems: {
        imageUpload: true,
        fileUpload: true,
        shareLocation: true
    },

    fixedIntroPane: false,

    prechatCapture: {
        enabled: true,
        enableEmailLinking: true,
        fields: [
            {
                type: 'email',
                name: 'email',
                label: 'Email',
                placeholder: 'your@email.com'
            },
            {
                type: 'text',
                name: 'company-website',
                label: 'Company website',
                placeholder: 'mycompany.com'
            },
            {
                type: 'select',
                name: 'company-size',
                label: 'Company size',
                placeholder: 'Choose a number...',
                options: [
                    {
                        name: '1-10',
                        label: '1-10 employees'
                    },
                    {
                        name: '11-50',
                        label: '11-50 employees'
                    },
                    {
                        name: '51+',
                        label: '51+ employees'
                    }
                ]
            }
        ]
    },

    customText: {
        actionPaymentCompleted: 'Payment Completed',
        actionPaymentError: 'An error occurred while processing the card. <br> Please try again or use a different card.',
        actionPostbackError: 'An error occurred while processing your action. Please try again.',
        clickToRetry: 'Message not delivered. Click to retry.',
        clickToRetryForm: 'Form not submitted. Click anywhere on the form to retry.',
        connectNotificationText: 'Give us a way to reach out:',
        connectNotificationSingleText: 'Be notified when you get a reply.',
        connectNotificationSingleButtonText: 'Turn on <name> notifications',
        connectNotificationOthersText: 'others',
        conversationTimestampHeaderFormat: 'MMMM D YYYY, h:mm A',
        couldNotConnect: 'Couldn\'t connect. You can {retry}. ',
        couldNotConnectInner: 'retry connecting now',
        couldNotConnectWithRetry: 'Couldn\'t connect. We\'ll keep retrying, or you can {retry}.',
        couldNotConnectWithRetryInner: 'try now',
        emailChangeAddress: 'Change my email',
        emailDescription: 'To be notified by email when you get a reply, enter your email address.',
        emailFieldLabel: 'Your email',
        emailFieldPlaceholder: 'Your email address',
        emailFormButton: 'Continue',
        fetchHistory: 'Load more',
        fetchingHistory: 'Retrieving history...',
        fileTooLargeError: 'Max file size limit exceeded ({size})',
        fileTypeError: 'Unsupported file type.',
        formErrorInvalidEmail: 'Email is invalid',
        formErrorNoLongerThan: 'Must contain no more than ({characters}) characters',
        formErrorNoShorterThan: 'Must contain at least ({characters}) characters',
        formErrorUnknown: 'This doesn\'t look quite right',
        formFieldSelectPlaceholderFallback: 'Choose one...',
        frontendEmailChannelDescription: 'To talk to us using email just send a message to our email address and we\'ll reply shortly:',
        headerText: 'How can we help?',
        imageClickToReload: 'Click to reload image.',
        imageClickToView: 'Click to view {size} image.',
        imagePreviewNotAvailable: 'Preview not available.',
        inputPlaceholder: 'Type a message...',
        inputPlaceholderBlocked: 'Complete the form above...',
        introAppText: 'Message us below or from your favorite app.',
        introductionText: 'We\'re here to talk, so ask us anything!',
        invalidFileError: 'Only images are supported. Choose a file with a supported extension (jpg, jpeg, png, gif, or bmp).',
        lineChannelDescription: 'To talk to us using LINE, scan this QR code using the LINE app and send us a message.',
        linkError: 'An error occurred when attempting to generate a link for this channel. Please try again.',
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
        messengerChannelDescription: 'Connect your Facebook Messenger account to be notified when you get a reply and continue the conversation on Facebook Messenger.',
        notificationSettingsChannelsDescription: 'You can also talk to us from your favorite app or service.',
        notificationSettingsChannelsTitle: 'Other Channels',
        notificationSettingsConnected: 'Connected',
        notificationSettingsConnectedAs: 'Connected as {username}',
        prechatCaptureGreetingText: 'Hi there 👋\nTo start off, we\'d like to know a little bit more about you:',
        prechatCaptureNameLabel: 'Your name',
        prechatCaptureNamePlaceholder: 'Type your name...',
        prechatCaptureEmailLabel: 'Email',
        prechatCaptureEmailPlaceholder: 'name@company.com',
        prechatCaptureConfirmationText: 'Thanks for that! What can we help you with?',
        prechatCaptureMailgunLinkingConfirmation: 'You\'ll be notified here and by email at {email} once we reply.',
        sendButtonText: 'Send',
        settingsHeaderText: 'Settings',
        shareLocation: 'Share location',
        smsBadRequestError: 'We were unable to communicate with this number. Try again or use a different one.',
        smsCancel: 'Cancel',
        smsChangeNumber: 'Change my number',
        smsChannelDescription: 'Connect your SMS number to be notified when you get a reply and continue the conversation over SMS.',
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
        tapToRetryForm: 'Form not submitted. Tap anywhere on the form to retry.',
        telegramChannelDescription: 'Connect your Telegram account to be notified when you get a reply and continue the conversation on Telegram',
        unsupportedMessageType: 'Unsupported message type.',
        unsupportedActionType: 'Unsupported action type.',
        uploadDocument: 'Upload document',
        uploadInvalidError: 'Invalid file',
        uploadPhoto: 'Upload photo',
        uploadVirusError: 'A virus was detected in your file and it has been rejected',
        viberChannelDescription: 'Connect your Viber account to be notified when you get a reply and continue the conversation on Viber. To get started, scan the QR code using the Viber app.',
        viberChannelDescriptionMobile: 'Connect your Viber account to be notified when you get a reply and continue the conversation on Viber. To get started, install the Viber app and tap Connect.',
        viberQRCodeError: 'An error occurred while fetching your Viber QR code. Please try again.',
        wechatChannelDescription: 'Connect your WeChat account to be notified when you get a reply and continue the conversation on WeChat. To get started, scan this QR code using the WeChat app.',
        wechatChannelDescriptionMobile: 'Connect your WeChat account to be notified when you get a reply and continue the conversation on WeChat. To get started, save this QR code image and upload it in the <a href=\'weixin://dl/scan\'>QR code scanner</a>.',
        wechatQRCodeError: 'An error occurred while fetching your WeChat QR code. Please try again.'
    }
}).then(function() {
    // Your code after init is complete
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

```javascript
Smooch.login('some-id', 'some-jwt');
```

#### logout()
Logs out the current user and reinitialize the widget with an anonymous user. This returns a promise that resolves when the Web Messenger is ready again.

```javascript
Smooch.logout();
```

#### destroy()
Destroys the Web Messenger and makes it disappear. The Web Messenger has to be reinitialized with `init` to be working again because it also clears up the app id from the Web Messenger. It will also unbind all listeners you might have with `Smooch.on`.

```javascript
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

#### startTyping()
Sends an event indicating the appUser has started typing. When called, a `stopTyping` timer will be created and will call `stopTyping()` after 10s, unless `stopTyping()` has been called manually. Everytime `startTyping()` is called the timer is reset. If `startTyping()` is called repeatedly, an event will only be sent if the time since the last sent event is greater then 10s.

```javascript
Smooch.startTyping();
```

#### stopTyping()
Sends an event indicating the appUser has stoped typing.

```javascript
Smooch.stopTyping();
```

#### triggerPostback(actionId)
Trigger a [postback](https://docs.smooch.io/rest/#postback) action on the user's behalf.
The `actionId` is the `_id` property of the targeted action.

If you have the `_id` of the targetted `postback` action, you can pass it directly to `triggerPostback`.

```javascript
const actionId = '5a747faa065bbe4e7804f2a4';
Smooch.triggerPostback(actionId);
```

Otherwise, you can get the `_id` of an action by using `Smooch.getConversation()`, e.g.

```javascript
const conversation = Smooch.getConversation();

console.log(conversation.messages);
// [
//     {
//         "text": "Do you want to continue?",
//         "actions": [
//             {
//                 "payload": "text:continue",
//                 "text": "Continue conversation",
//                 "_id": "5a7c65211aaa9b61f69c95e3",
//                 "type": "postback"
//             }
//         ],
//         "type": "text",
//         "role": "appMaker",
//         "_id": "5a7c65211aaa9b61f69c95e2",
//         // ...
//     }
// ]

// Indicate to Smooch that the user has clicked on the "Continue conversation" postback action.
Smooch.triggerPostback(conversation.messages[0].actions[0]._id);
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

#### markAllAsRead()
Marks all unread messages as read.

```javascript
Smooch.markAllAsRead();
```

#### showNotificationChannelPrompt()
Displays a prompt to the user suggesting the linking of the current chat instance with other 3rd-party apps.

```javascript
Smooch.showNotificationChannelPrompt();
```

#### setPredefinedMessage(message)
Prefills the user's chat input with a predefined message.

```javascript
Smooch.setPredefinedMessage(message);
```

#### setDelegate(delegate)
Sets a delegate on the conversation. Smooch must be initialized before calling this method. See the [delegate](#delegate) section for more details.

```javascript
Smooch.setDelegate(delegate);
```

### Delegate
Smooch allows you to set a delegate to receive callbacks when important changes happen in the conversation.
To set a delegate, pass the `delegate` parameter in to [init options](#options), or use the [setDelegate](#setdelegatedelegate) method. The `delegate` object may optionally contain `beforeDisplay`, `beforeSend`, `beforePostbackSend` and `onInvalidAuth` delegate functions.

Passing `delegate` as part of `init` options is the preferred method. The `setDelegate` method can be used to change or remove delegate behaviors after a conversation has been initialized.

```javascript
const delegate = {
    beforeDisplay(message) {
        return message;
    },
    beforeSend(message) {
        return message;
    },
    beforePostbackSend(postback) {
        return postback;
    },
    onInvalidAuth() {
        return new Promise((resolve) =>
            resolve('<my-new-auth-token>')
        )
    }
}

// Passing delegate as an init parameter
Smooch.init({
    appId: '<app-id>',
    delegate
});

// Using setDelegate
Smooch.init({ appId: '<app-id>' }).then(() => {
    Smooch.setDelegate(delegate);
});
```

#### beforeDisplay
The `beforeDisplay` delegate allows a message to be hidden or modified before it is displayed in the conversation. This delegate should return a falsy value such as `null` to hide the message. It can also return a modified message object in order to change what the user will see rendered in their conversation history. Note that this change affects the client side rendering only; the server side copy of this message can not be modified by this delegate.

Learn more about filtering and transforming messages in [our guide](https://docs.smooch.io/guide/web-messenger#filtering-and-transforming-messages).

```javascript
Smooch.init({
    appId: '<app-id>',
    delegate: {
        beforeDisplay(message) {
            if (message.metadata && message.metadata.isHidden) {
                return null;
            }

            return message;
        }
    }
});
```

#### beforeSend
The `beforeSend` delegate method allows you to modify properties of a message before sending it to Smooch.
The modified message must be returned for it to take effect.

A common usage of this method is to [add message metadata](https://docs.smooch.io/guide/using-metadata/#sdks-and-metadata).

Note that when a file or an image is uploaded, only the message `metadata` may be updated. Other message properties such as `type` or `text` won't be considered.

```javascript
Smooch.init({
    appId: '<app-id>'
    delegate: {
        beforeSend(message) {
            message.metadata = {
                any: 'info'
            };

            return message;
        }
    }
});
```

#### beforePostbackSend
The `beforePostbackSend` delegate method allows you to modify properties of a postback before sending it to Smooch.
The modified postback must be returned for it to take effect.

A common usage of this method is to [add postback metadata](https://docs.smooch.io/guide/web-messenger#transforming-postback).

```javascript
Smooch.init({
    appId: '<app-id>',
    delegate: {
        beforePostbackSend(postback) {
            postback.metadata = {
                any: 'info'
            };

            return postback;
        }
    }
});
```

#### onInvalidAuth
The `onInvalidAuth` delegate notifies the delegate of a failed request due to invalid credentials and allows the implementer to set a new auth token in order to retry the request. The delegate must return a new JWT token as a `string` or `Promise<string>` that will resolve into the JWT.

```javascript
Smooch.init({
    appId: '<app-id>',
    delegate: {
        onInvalidAuth() {
            return '<my-new-auth-token>';
        }
    }
});
```

### Events
If you want to make sure your events are triggered, try to bind them before calling `Smooch.init`.

To bind an event, use `Smooch.on(<event name>, <handler>);`. To unbind events, you can either call `Smooch.off(<event name>, handler)` to remove one specific handler, call `Smooch.off(<event name>)` to remove all handlers for an event, or call `Smooch.off()` to unbind all handlers.

#### ready
```javascript
// This event triggers when init completes successfully... Be sure to bind before calling init!
Smooch.on('ready', function(){
    console.log('the init has completed!');
});

Smooch.init(...).then(function() {
    // init also returns a promise, so you can alternatively specify a .then() callback
});
```

#### destroy
```javascript
// This event triggers when the widget is destroyed.
Smooch.on('destroy', function(){
    console.log('the widget is destroyed!');
});

Smooch.destroy();
```

#### message:received
```javascript
// This event triggers when the user receives a message
Smooch.on('message:received', function(message) {
    console.log('the user received a message', message);
});
```

#### message:sent
```javascript
// This event triggers when the user sends a message
Smooch.on('message:sent', function(message) {
    console.log('the user sent a message', message);
});
```

#### message
```javascript
// This event triggers when a message was added to the conversation
Smooch.on('message', function(message) {
    console.log('a message was added to the conversation', message);
});
```

#### unreadCount
```javascript
// This event triggers when the number of unread messages changes
Smooch.on('unreadCount', function(unreadCount) {
    console.log('the number of unread messages was updated', unreadCount);
});
```

#### widget:opened
```javascript
// This event triggers when the widget is opened
Smooch.on('widget:opened', function() {
    console.log('Widget is opened!');
});
```

#### widget:closed
```javascript
// This event triggers when the widget is closed
Smooch.on('widget:closed', function() {
    console.log('Widget is closed!');
});
```

#### log:debug
```javascript
// This event triggers when the codes emits debug information
Smooch.on('log:debug', function(e) {
    console.log('Timestamp': e.timestamp); // (Float) Date.now() when it was emitted
    console.log('Message': e.message); // (String) Message being logged
    console.log('Data': e.data); // (Object) Extra details to be logged
});
```

#### connected
```javascript
// This event triggers when an active connection has been established for the first time,
// or when the connection has been re-established after a `disconnect` event.
Smooch.on('connected', function(e) {
    console.log('Connected');
});
```

#### disconnected
```javascript
// This event triggers when an active connection is lost
// While disconnected, the client will not be able to recieve messages
Smooch.on('disconnected', function(e) {
    console.log('Disonnected');
});
```

#### typing:start
```javascript
// This event triggers when appMaker starts typing
Smooch.on('typing:start', function() {
    console.log('appMaker starts typing!');
});
```

#### typing:stop
```javascript
// This event triggers when appMaker stops typing
Smooch.on('typing:stop', function() {
    console.log('appMaker stops typing!');
});
```

### Embedded mode
As describe above, to activate the embedded mode, you need to pass `embedded: true` when calling `Smooch.init`. By doing so, you are disabling the auto-rendering mechanism and you will need to call `Smooch.render` manually. This method accepts a DOM element which will be used as the container where the widget will be rendered.

```javascript
Smooch.init({
    appId: '<app-id>',
    embedded: true
});

Smooch.render(document.getElementById('chat-container'));
```

The embedded widget will take full width and height of the container. You must give it a height, otherwise, the widget will collapse.

### Authenticating the user: init() vs login()

For [authenticated user scenarios](https://docs.smooch.io/guide/authenticating-users/), a user's credentials can be passed in to either `init()` or `login()`. The question remains: when should you use which?

When `init()` is called without a `userId` and `jwt`, the UI will be initialized in an anonymous user context, and the user will be able to send messages as an anonymous user. After `init()` has completed, `login()` may be called to authenticate the user and resume any existing conversation. This is useful if you want your users to be able to send messages before they've logged in to your website. Once a user does login and the browser is issued a valid `jwt`, `login()` may be called so that the user may continue the conversation in an authenticated session.

If however your use case requires that all users be logged in before they may send messages, then you should consider passing `userId` and `jwt` directly to the `init()` call upfront.

## Content Security Policy
If your deployment requires [CSP compatibility](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP), add the following meta tag to your configuration.
```html
<meta http-equiv="Content-Security-Policy" content="
    connect-src
        wss://*.smooch.io
        https://*.smooch.io;
    font-src
        https://*.smooch.io;
    script-src
        https://*.smooch.io;
    style-src
        https://*.smooch.io;
    img-src
        blob:
        https://*.smooch.io;">
```
Note that an equivalent configuration can be done [server side](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy).

According to the channels you use, other domains may need to be added (these are used to display QR codes to link the Web Messenger conversation):
- LINE: https://qr-official.line.me
- WeChat: https://mp.weixin.qq.com

Note that your CSP configuration should also include any domains used to host images or files sent in messages.
If you require `blob:` to be excluded for `img-src`, you must disable the image upload feature via the [init settings](#initoptions).

## Acknowledgements

https://github.com/lipis/flag-icon-css
