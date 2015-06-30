# [SupportKit Javascript SDK](supportkit.io)
Build status: [![Circle CI](https://circleci.com/gh/supportkit/supportkit-js.svg?style=svg)](https://circleci.com/gh/supportkit/supportkit-js)
## Usage

### Script Tag

Add the following code in between the ```<head>...</head>``` tags on your page.

```html
<script src="https://cdn.supportkit.io/supportkit.min.js"></script>
```

Initialize the plugin using this code snippet

```html
<script>
    SupportKit.init({appToken: 'your_app_token'});
</script>
```

### In Node.js and Browserify

Install from npm

```
npm install supportkit-js
```

Require and init

```javascript
var SupportKit = require('supportkit-js');

SupportKit.init({appToken: 'your_app_token'});
```

### Bower

Install from bower

```
bower install supportkit-js
```

Include in JS using preferred method and init

```javascript
SupportKit.init({appToken: 'your_app_token'});
```

## API

### Individual functions

#### init(options)
Initializes the SupportKit widget in the web page using the specified options

```javascript
SupportKit.init({
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

#### destroy()
Destroys the widget completely. Can be initiated again manually with `SupportKit.init(...)`

```javascript
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
