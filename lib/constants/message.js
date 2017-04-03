'use strict';

exports.__esModule = true;
var SEND_STATUS = exports.SEND_STATUS = {
    SENDING: 'sending',
    FAILED: 'failed',
    SENT: 'sent'
};

var LOCATION_ERRORS = exports.LOCATION_ERRORS = {
    PERMISSION_DENIED: 1,
    POSITION_UNAVAILABLE: 2,
    TIMEOUT: 3
};

var GLOBAL_ACTION_TYPES = exports.GLOBAL_ACTION_TYPES = ['reply', 'locationRequest'];