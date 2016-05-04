# [Smooch Javascript SDK](smooch.io)
*Smooch adds beautifully simple messaging to your app to keep your users engaged and coming back.*

[![Circle CI](https://circleci.com/gh/smooch/smooch-js.svg?style=svg)](https://circleci.com/gh/smooch/smooch-js) [![npm version](https://badge.fury.io/js/smooch.svg)](http://badge.fury.io/js/smooch) [![Bower version](https://badge.fury.io/bo/smooch.svg)](http://badge.fury.io/bo/smooch)

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

### Browserify

Install from npm

```
npm install smooch
```

Require and init

```javascript
var Smooch = require('smooch');

Smooch.init({appToken: 'your_app_token'});
```

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
| emailCaptureEnabled | Yes | `false` | Enables prompt for email after the first user's message. You can retrieve that email in Slack using `/sk !profile`. We are aware of this limitation and are working on improving it. |
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
    emailCaptureEnabled: false,
    customText: {
        headerText: 'How can we help?',
        inputPlaceholder: 'Type a message...',
        sendButtonText: 'Send',
        introText: 'This is the beginning of your conversation.<br/> Ask us anything!',
        settingsText: 'You can leave us your email so that we can get back to you this way.',
        settingsReadOnlyText: 'We\'ll get back to you at this email address if we missed you.',
        settingsInputPlaceholder: 'Your email address',
        settingsSaveButtonText: 'Save',
        settingsHeaderText: 'Email Settings',
        settingsNotificationText: 'In case we\'re slow to respond you can <a href data-ui-settings-link>leave us your email</a>.',
        actionPaymentError: 'An error occurred while processing the card. <br> Please try again or use a different card.',
        actionPaymentCompleted: 'Payment Completed',
        messageError: 'An error occured while sending your message. Please try again.',
        invalidFileError: 'Sorry, but only images are supported currently. Please choose a file with a supported extension (jpg, jpeg, png, gif, or bmp).',
        messageIndicatorTitleSingular: '({count}) New message',
        messageIndicatorTitlePlural: '({count}) New messages'
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

#### sendMessage(text)
Sends a message on the user's behalf

```javascript
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
```git clone https://github.com/smooch/smooch-js```

### Install Node.js and run the following

```npm install```

In one console, run `npm run start-dev` to start the web server. In another, run `npm run hot-dev-server` to start the webpack dev server.

Then, go to `http://localhost:8282` to test the normal widget or `http://localhost:8282/embedded` for the embedded one.
