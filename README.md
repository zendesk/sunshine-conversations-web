# [SupportKit Javascript SDK](supportkit.io)
*SupportKit adds beautifully simple messaging to your app to keep your users engaged and coming back.*

[![Circle CI](https://circleci.com/gh/supportkit/supportkit-js.svg?style=svg)](https://circleci.com/gh/supportkit/supportkit-js) [![npm version](https://badge.fury.io/js/supportkit.svg)](http://badge.fury.io/js/supportkit) [![Bower version](https://badge.fury.io/bo/supportkit.svg)](http://badge.fury.io/bo/supportkit)

## Usage

### Script Tag

Add the following code towards the end of the `body` section on your page. Placing it at the end allows the rest of the page to load first.

```html
<script src="https://cdn.supportkit.io/supportkit.min.js"></script>
```


Initialize the plugin using this code snippet

```html
<script>
    SupportKit.init({appToken: 'your_app_token'});
</script>
```

### Browserify

Install from npm

```
npm install supportkit
```

Require and init

```javascript
var SupportKit = require('supportkit');

SupportKit.init({appToken: 'your_app_token'});
```

### Bower

Install from bower

```
bower install supportkit
```

Include in JS using preferred method and init

```javascript
SupportKit.init({appToken: 'your_app_token'});
```

## API

### Individual functions

#### init(options)
Initializes the SupportKit widget in the web page using the specified options. It returns a promise that will resolve when the widget is ready.

##### Options
| Option | Optional? | Default value | Description |
| --- | --- | --- |
| appToken | No | - | Your app token |
| givenName | Yes | - | User's given name |
| surname | Yes | - | User's surname |
| email | Yes | - | User's email |
| userId | Yes | - | User's id |
| properties | Yes | - | An object with all properties you want to set on your user |
| emailCaptureEnabled | Yes | `false` | Enables prompt for email after the first user's message. You can retrieve that email in Slack using `/sk !profile`. We are aware of this limitation and are working on improving it. |

##### Example
```javascript
var skPromise = SupportKit.init({
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
Opens the conversation widget

```javascript
SupportKit.open();
```

#### close()
Closes the conversation widget

```javascript
SupportKit.close();
```

#### login(userId [, jwt])
Logs a user in the widget, retrieving the conversation that user already had on other browsers and/or devices. This will destroy and reinitialize the widget with the user's data. Note that you don't need to call this after `init`, it's already done internally. This returns a promise that resolves when the widget is ready again.
```
SupportKit.login('some-id');

// in case you are using the jwt authentication
SupportKit.login('some-id', 'some-jwt');

```

#### logout()
Logs out the current user and reinitialize the widget with an anonymous user.This returns a promise that resolves when the widget is ready again.

```
SupportKit.logout();
```

#### destroy()
Destroys the widget and makes it disappear. The widget has to be reinitialized with `init`  to be working again because it also clears up the app token from the widget.

```
SupportKit.destroy();
```

#### sendMessage(text)
Sends a message on the user's behalf

```javascript
SupportKit.message('hello');
```

#### updateUser(user)
Updates user information

```javascript
SupportKit.updateUser({
    givenName: 'Updated',
    surname: 'Name',
    email: 'updated@email.com',
    properties: {
      'justGotUpdated': true
    }
});
```

#### track(eventName)
Tracks an event for the current user. 

```javascript
SupportKit.track('item-in-cart');
```

### Events
If you want to make sure your events are triggered, try to bind them before calling `SupportKit.init`.

#### ready
```
// This event triggers when init completes successfully... Be sure to bind before calling init!
SupportKit.on('ready', function(){
    console.log('the init has completed!');
});

SupportKit.init(...);
```

#### destroy
```
// This event triggers when init completes successfully... Be sure to bind before calling init!
SupportKit.on('destroy', function(){
    console.log('the widget is destroyed!');
});

SupportKit.destroy();
```

## How to contribute

### Clone the git repo
```git clone https://github.com/supportkit/supportkit-js```

### Install Node.js and run the following

```npm install```
```npm install -g grunt```

### Essential Grunt Tasks

* ```grunt build``` dumps a plain and a minified file from all files in the folder ```src``` to dist/supportkit.min.js
* ```grunt clean``` removes all files in the folder ```dist```
* ```grunt test:unit``` runs karma tests
