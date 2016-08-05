'use strict';

exports.__esModule = true;
exports.setAuth = setAuth;
exports.resetAuth = resetAuth;
var SET_AUTH = exports.SET_AUTH = 'SET_AUTH';
var RESET_AUTH = exports.RESET_AUTH = 'RESET_AUTH';

function setAuth(props) {
    return {
        type: SET_AUTH,
        props: props
    };
}

function resetAuth() {
    return {
        type: RESET_AUTH
    };
}