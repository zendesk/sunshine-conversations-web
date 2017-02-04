'use strict';

exports.__esModule = true;
exports.setUser = setUser;
exports.updateUser = updateUser;
exports.resetUser = resetUser;
var SET_USER = exports.SET_USER = 'SET_USER';
var UPDATE_USER = exports.UPDATE_USER = 'UPDATE_USER';
var RESET_USER = exports.RESET_USER = 'RESET_USER';

function setUser(props) {
    return {
        type: SET_USER,
        user: props
    };
}

function updateUser(properties) {
    return {
        type: UPDATE_USER,
        properties: properties
    };
}

function resetUser() {
    return {
        type: RESET_USER
    };
}