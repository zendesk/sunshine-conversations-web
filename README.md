# [Smooch Web Messenger](https://smooch.io)

  [![Circle CI](https://circleci.com/gh/smooch/smooch-js.svg?style=svg)](https://circleci.com/gh/smooch/smooch-js)
  [![npm version](https://badge.fury.io/js/smooch.svg)](http://badge.fury.io/js/smooch)
  [![Bower version](https://badge.fury.io/bo/smooch.svg)](http://badge.fury.io/bo/smooch)

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

Add the following code towards the end of the `body` section on your page. Placing it at the end allows the rest of the page to load first.

```html
<script src="https://cdn.smooch.io/smooch.min.js"></script>
```


Initialize the plugin using this code snippet

```html
<script>
    Smooch.init({appToken: 'your_app_token'});
</script>
```

### Browserify and Webpack

Install from npm

```
npm install --save smooch

// The library also has peer dependencies. If you don't already have them in your project, go ahead and install them too

npm install --save babel-polyfill@6.9 babel-runtime@6.9 react@15 react-dom@15
```

Require and init

```javascript
var Smooch = require('smooch');

Smooch.init({appToken: 'your_app_token'});
```

#### Notes about Webpack
If you are building an isomorphic app, make sure you init the widget in client code only. It currently won't work on the server side. You'll also need to add the following to your plugins since `iconv-loader` doesn't work very well with webpack :

```javascript
new webpack.NormalModuleReplacementPlugin(/\/iconv-loader$/, 'node-noop')
```

You will need to install `node-noop` in your project.
See https://github.com/andris9/encoding/issues/16

#### Notes about Angular 2
Some users reported that including the Smooch Web Messenger script in their Angular 2 app would cause some problems. The [workaround](https://github.com/smooch/smooch-js/issues/404#issuecomment-257768495) for that is to add it after all your scripts.

### Bower

Install from bower

```
bower install smooch
```

Include in JS using preferred method and init

```javascript
Smooch.init({appToken: 'your_app_token'});
```

## API

### Individual functions

#### init(options)
Initializes the Smooch widget in the web page using the specified options. It returns a promise that will resolve when the widget is ready.

##### Options

| Option | Optional? | Default value | Description |
| --- | --- | --- | --- |
| appToken | No | - | Your app token |
| givenName | Yes | - | User's given name |
| surname | Yes | - | User's surname |
| email | Yes | - | User's email |
| jwt | Yes | - | Token to authenticate your communication with the server (see http://docs.smooch.io/javascript/#authenticating-users-optional)
| userId | Yes | - | User's id |
| properties | Yes | - | An object with all properties you want to set on your user |
| emailCaptureEnabled | Yes | `false` | *Deprecated* won't be supported in 4.x - Enables prompt for email after the first user's message. You can retrieve that email in Slack using `/sk !profile`. Forced to false if other messaging channels are enabled in your Smooch app |
| soundNotificationEnabled | Yes | `true` | Enables the sound notification for new messages |
| imageUploadEnabled | Yes | `true` | Enables the image upload feature. |
| embedded | Yes | False | Tells the widget it will be embedded. (see Embedded section below) |
| customText | Yes | See the example below | Strings used in the widget UI. You can use these to either customize the text or translate it. If something is between `{}`, it's a variable and needs to stay in your customized text if you want to use it. |

```javascript
var skPromise = Smooch.init({
    appToken: 'your_app_token',
    givenName: 'Cool',
    surname: 'Person',
    email: 'their_email@whatever.com',
    // For secure mode
    jwt: 'your_jwt',
    userId: 'user_id',
    // Additional properties
    properties: {
        'anything': 'whatever_you_want'    
    },
    customText: {
        headerText: 'How can we help?',
        inputPlaceholder: 'Type a message...',
        sendButtonText: 'Send',
        introductionText: 'We\'re here to talk, so ask us anything!',
        introAppText: 'Message us below or from your favorite app.',
        settingsText: 'You can leave us your email so that we can get back to you this way.',
        settingsReadOnlyText: 'We\'ll get back to you at this email address if we missed you.',
        settingsInputPlaceholder: 'Your email address',
        settingsSaveButtonText: 'Save',
        settingsHeaderText: 'Settings',
        settingsNotificationText: 'In case we\'re slow to respond you can <a href data-ui-settings-link>leave us your email</a>.',
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

#### login(userId [, jwt] [, attributes])
Logs a user in the widget, retrieving the conversation that user already had on other browsers and/or devices. This will destroy and reinitialize the widget with the user's data. Note that you don't need to call this after `init`, it's already done internally. This returns a promise that resolves when the widget is ready again.
```
Smooch.login('some-id');

// in case you are using the jwt authentication
Smooch.login('some-id', 'some-jwt');

// in case you want to update user attributes at the same time
Smooch.login('some-id', { email: 'my@new-email.com'});

// in case you want to update user attributes at the same time and use jwt
Smooch.login('some-id', 'some-jwt', { email: 'my@new-email.com'});

```

#### logout()
Logs out the current user and reinitialize the widget with an anonymous user.This returns a promise that resolves when the widget is ready again.

```
Smooch.logout();
```

#### destroy()
Destroys the widget and makes it disappear. The widget has to be reinitialized with `init`  to be working again because it also clears up the app token from the widget. It will also unbind all listeners you might have with `Smooch.on`.

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

#### getUserId()
Returns the userId of the current user.

```javascript
Smooch.getUserId()
```

#### getConversation()
Returns promise that resolves to conversation object, or rejects if none exists

```javascript
Smooch.getConversation().then(conversation => ...);
```

#### track(eventName)
Tracks an event for the current user.

```javascript
Smooch.track('item-in-cart');
```

#### getCore()
Returns an instance of [smooch-core](https://github.com/smooch/smooch-core-js) to allow access to APIs the Web Messenger doesn't expose. For more information on how to use Smooch-Core, please visit the [documentation](http://docs.smooch.io/rest/?javascript).

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
git clone https://github.com/smooch/smooch-js
```

### Install Node.js and run the following

```
npm install
```

In one console, run `npm run dev` to start the web server.

Then, go to `http://localhost:8282` to test the normal widget or `http://localhost:8282/embedded` for the embedded one.

## Acknowledgements

https://github.com/lipis/flag-icon-css
