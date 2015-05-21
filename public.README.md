# SupportKit Javascript SDK

### 1. Install it
With Node.js and Browserify
* ```npm install --save supportkit```
With bower
* ```bower install supportkit```

### 2. Require it

var SupportKit = require('supportkit');

### 3. Use it

SupportKit.init({appToken: 'your_app_token_here',
  givenName: 'Cool',
  surname: 'Dude',
  properties: {
    'whateverYouWant': true
  }
});