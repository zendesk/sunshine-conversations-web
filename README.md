# [Smooch Web Messenger](https://smooch.io)

  [![Circle CI](https://circleci.com/gh/smooch/smooch-web.svg?style=svg)](https://circleci.com/gh/smooch/smooch-web)
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

Web messenger supports all popular browsers. 

#### Desktop versions

Chrome: Latest and one behind
Edge: Latest and one behind
Firefox: Latest and one behind
Internet Explorer: 11+
Safari: Latest and one behind
Opera: Latest

#### Mobile versions

Stock browser on Android 4.1+
Safari on iOS 8+

#### Other browsers

Web messenger is likely compatible with other and older browsers but we only test against the versions above.

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
    customText: {
        headerText: 'How can we help?',
        inputPlaceholder: 'Type a message...',
        sendButtonText: 'Send',
        introductionText: 'We\'re here to talk, so ask us anything!',
        introAppText: 'Message us below or from your favorite app.',
        settingsHeaderText: 'Settings',
        actionPaymentError: 'An error occurred while processing the card. <br> Please try again or use a different card.',
        actionPaymentCompleted: 'Payment Completed',
        actionPostbackError: 'An error occurred while processing your action. Please try again.',
        messageError: 'An error occured while sending your message. Please try again.',
        invalidFileError: 'Only images are supported. Choose a file with a supported extension (jpg, jpeg, png, gif, or bmp).',
        messageIndicatorTitleSingular: '({count}) New message',
        messageIndicatorTitlePlural: '({count}) New messages',
        connectNotificationText: 'Be notified inside your other apps when you get a reply.',
        notificationSettingsChannelsTitle: 'Other Channels',
        notificationSettingsChannelsDescription: 'You can also talk to us from your favorite app or service.',
        notificationSettingsConnectedAs: 'Connected as {username}',
        notificationSettingsConnected: 'Connected',
        wechatQRCodeError: 'An error occurred while fetching your WeChat QR code. Please try again.',
        messengerChannelDescription: 'Connect your Facebook Messenger account to be notified when you get a reply and carry the conversation on Facebook Messenger.',
        frontendEmailChannelDescription: 'To talk to us using email just send a message to our email address and we\'ll reply shortly:',
        smsChannelDescription: 'Connect your SMS number to be notified when you get a reply and carry the conversation over SMS.',
        smsChannelPendingDescription: 'Check your messages at {number} to confirm your phone number.',
        telegramChannelDescription: 'Connect your Telegram account to be notified when you get a reply and carry the conversation on Telegram',
        wechatChannelDescriptionMobile: 'Connect your WeChat account to be notified when you get a reply and carry the conversation on WeChat. To get started, save this QR code image and upload it in the <a href=\'weixin://dl/scan\'>QR code scanner</a>.',
        wechatChannelDescription: 'Connect your WeChat account to be notified when you get a reply and carry the conversation on WeChat. To get started, scan this QR code using the WeChat app.',
        lineChannelDescription: 'To talk to us using LINE, scan this QR code using the LINE app and send us a message.',
        viberChannelDescriptionMobile: 'Connect your Viber account to be notified when you get a reply and carry the conversation on Viber. To get started, install the Viber app and tap Connect.',
        viberChannelDescription: 'Connect your Viber account to be notified when you get a reply and carry the conversation on Viber. To get started, scan the QR code using the Viber app.',
        smsTooManyRequestsError: 'A connection for that number was requested recently. Please try again in {seconds} seconds.',
        smsBadRequestError: 'We were unable to communicate with this number. Try again or use a different one.',
        smsUnhandledError: 'Something went wrong. Please try again.',
        smsPingChannelError: 'There was an error sending a message to your number.',
        smsLinkCancelled: 'Link to {appUserNumber} was cancelled.',
        smsLinkPending: 'Pending',
        smsStartTexting: 'Start Texting',
        smsChangeNumber: 'Change my number',
        smsSendText: 'Send me a text',
        smsContinue: 'Continue',
        smsCancel: 'Cancel',
        transferError: 'An error occurred when attempting to generate a link for this channel. Please try again.',
        fetchingHistory: 'Retrieving history...',
        fetchHistory: 'Load more',
        clickToRetry: 'Message not delivered. Click to retry.',
        tapToRetry: 'Message not delivered. Tap to retry.',
        locationSendingFailed: 'Could not send location',
        locationServicesDenied: 'This website cannot access your location. Please type your location instead.',
        locationNotSupported: 'This website cannot access your location. Allow access in your settings or type your location instead.',
        locationSecurityRestriction: 'Your browser does not support location services or it’s been disabled. Please type your location instead.'
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

## How to contribute

### Clone the git repo
```
git clone https://github.com/smooch/smooch-web
```

### Install Node.js and run the following

```
npm install
```

In one console, run `npm run dev` to start the web server.

Then, go to `http://localhost:8282` to test the normal widget or `http://localhost:8282/embedded` for the embedded one.

## How to generate a custom build
1. Make changes to the code.
2. Run `VERSION=X.Y.Z PUBLIC_PATH=https://your.cdn.com npm run build` (replace `https://your.cdn.com` with the address where the files will be hosted and also replace `X.Y.Z` with the version number you want).
3. Take everything in `dist/` and host it at the address above.
4. Make sure your server allow cross-origin requests to allow loading the library.
5. Include the library in the `head` section of your page with a script tag (`<script src="https://your.cdn.com/smooch.X.Y.Z.min.js"></script>`). The script loader is not necessary when using a custom build.

## Acknowledgements

https://github.com/lipis/flag-icon-css
