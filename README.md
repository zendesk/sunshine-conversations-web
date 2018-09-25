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

Add the following code towards the end of the `head` section on your page and replace `<app-id>` with your app id at the end of the script.

```html
<script>
    !function(e,n,t,r){
        function o(){try{var e;if((e="string"==typeof this.response?JSON.parse(this.response):this.response).url){var t=n.getElementsByTagName("script")[0],r=n.createElement("script");r.async=!0,r.src=e.url,t.parentNode.insertBefore(r,t)}}catch(e){}}var s,p,a,i=[],c=[];e[t]={init:function(){s=arguments;var e={then:function(n){return c.push({type:"t",next:n}),e},catch:function(n){return c.push({type:"c",next:n}),e}};return e},on:function(){i.push(arguments)},render:function(){p=arguments},destroy:function(){a=arguments}},e.__onWebMessengerHostReady__=function(n){if(delete e.__onWebMessengerHostReady__,e[t]=n,s)for(var r=n.init.apply(n,s),o=0;o<c.length;o++){var u=c[o];r="t"===u.type?r.then(u.next):r.catch(u.next)}p&&n.render.apply(n,p),a&&n.destroy.apply(n,a);for(o=0;o<i.length;o++)n.on.apply(n,i[o])};var u=new XMLHttpRequest;u.addEventListener("load",o),u.open("GET","https://"+r+".webloader.smooch.io/",!0),u.responseType="json",u.send()
    }(window,document,"Smooch","<app-id>");
</script>
```

then initialize the Web Messenger by placing this snippet towards the end of the `body` section of your page.

```html
<script>
    Smooch.init({appId: '<app-id>'}).then(function() {
        // Your code after init is complete
    });
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
| jwt | Yes | - | Token to authenticate your communication with the server (see http://docs.smooch.io/javascript/#authenticating-users-optional)
| userId | Yes | - | User's id |
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
| customColors | Yes | See below. | Colors used in the Web Messenger UI. |
| customText | Yes | See the example below | Strings used in the Web Messenger UI. You can use these to either customize the text or translate it. *Note*: Some strings include variables (surrounded by `{}`) which must remain in your customized text. |
| menuItems | Yes | See below. | Choose menu items. |
| notificationChannelPromptEnabled | Yes | `true` | Enables displaying a prompt to new users after their first message to suggest linking their chat instance with their other 3rd-party apps. |

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
| connectNotificationText | Be notified inside your other apps when you get a reply. |
| connectNotificationSingleText | Be notified when you get a reply. |
| connectNotificationSingleButtonText | Turn on `<name>` notifications |
| connectNotificationOthersText | others |
| conversationTimestampHeaderFormat | MMMM D YYYY, h:mm A |
| emailChangeAddress | Change my email |
| emailDescription | To be notified by email when you get a reply, enter your email address. |
| emailFieldLabel | Your email |
| emailFieldPlaceholder | Your email address |
| emailFormButton | Continue |
| fetchHistory | Load more |
| fetchingHistory | Retrieving history... |
| frontendEmailChannelDescription | To talk to us using email just send a message to our email address and we\'ll reply shortly: |
| headerText | How can we help? |
| imageClickToReload | Click to reload image. |
| imageClickToView | Click to view {size} image. |
| imagePreviewNotAvailable | Preview not available. |
| inputPlaceholder | Type a message... |
| introAppText | Message us below or from your favorite app. |
| introductionText | We\'re here to talk, so ask us anything! |
| invalidFileError | Only images are supported. Choose a file with a supported extension (jpg, jpeg, png, gif, or bmp). |
| lineChannelDescription | To talk to us using LINE, scan this QR code using the LINE app and send us a message. |
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
| sendButtonText | Send |
| settingsHeaderText | Settings |
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
| telegramChannelDescription | Connect your Telegram account to be notified when you get a reply and continue the conversation on Telegram |
| unsupportedMessageType | Unsupported message type. |
| unsupportedActionType | Unsupported action type. |
| linkError | An error occurred when attempting to generate a link for this channel. Please try again. |
| viberChannelDescription | Connect your Viber account to be notified when you get a reply and continue the conversation on Viber. To get started, scan the QR code using the Viber app. |
| viberChannelDescriptionMobile | Connect your Viber account to be notified when you get a reply and continue the conversation on Viber. To get started, install the Viber app and tap Connect. |
| viberQRCodeError | An error occurred while fetching your Viber QR code. Please try again. |
| wechatChannelDescription | Connect your WeChat account to be notified when you get a reply and continue the conversation on WeChat. To get started, scan this QR code using the WeChat app. |
| wechatChannelDescriptionMobile | Connect your WeChat account to be notified when you get a reply and continue the conversation on WeChat. To get started, save this QR code image and upload it `<a href=\'weixin://dl/scan\'>`QR code scanner`</a>`. |
| wechatQRCodeError | An error occurred while fetching your WeChat QR code. Please try again. |

See below for an example.

##### `menuItems`


| Option        | Optional? | Default value | Description                            |
| ------------- | --------- | ------------- | -------------------------------------- |
| imageUpload   | Yes       | `true`        | Enables the image upload menu item.    |
| fileUpload    | Yes       | `true`        | Enables the file upload menu item.     |
| shareLocation | Yes       | `true`        | Enables the share location menu item.  |

See below for an example.

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
        imageClickToReload: 'Click to reload image.',
        imageClickToView: 'Click to view {size} image.',
        imagePreviewNotAvailable: 'Preview not available.',
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
        messengerChannelDescription: 'Connect your Facebook Messenger account to be notified when you get a reply and continue the conversation on Facebook Messenger.',
        notificationSettingsChannelsDescription: 'You can also talk to us from your favorite app or service.',
        notificationSettingsChannelsTitle: 'Other Channels',
        notificationSettingsConnected: 'Connected',
        notificationSettingsConnectedAs: 'Connected as {username}',
        sendButtonText: 'Send',
        settingsHeaderText: 'Settings',
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
        telegramChannelDescription: 'Connect your Telegram account to be notified when you get a reply and continue the conversation on Telegram',
        unsupportedMessageType: 'Unsupported message type.',
        unsupportedActionType: 'Unsupported action type.',
        linkError: 'An error occurred when attempting to generate a link for this channel. Please try again.',
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
Sets a delegate on the conversation. See the [delegate](#delegate) section for more details.

```javascript
Smooch.setDelegate(delegate);
```

### Delegate
Smooch allows you to set a delegate to receive callbacks when important changes happen in the conversation.
To set a delegate, use the [setDelegate](#setdelegatedelegate) method.

#### beforeSend
The `beforeSend` delegate method allows you to modify properties of a message before sending it to Smooch.
The modified message must be returned for it to take effect.

A common usage of this method is to [add message metadata](https://docs.smooch.io/guide/using-metadata/#sdks-and-metadata).

```javascript
Smooch.setDelegate({
    beforeSend: (message) => {
        message.metadata = {
            any: 'info'
        };

        return message;
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

### Embedded mode
As describe above, to activate the embedded mode, you need to pass `embedded: true` when calling `Smooch.init`. By doing so, you are disabling the auto-rendering mechanism and you will need to call `Smooch.render` manually. This method accepts a DOM element which will be used as the container where the widget will be rendered.

The embedded widget will take full width and height of the container. You must give it a height, otherwise, the widget will collapse.

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
