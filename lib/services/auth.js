'use strict';

exports.__esModule = true;
exports.login = login;

var _core = require('./core');

function login(props) {
    return function (dispatch, getState) {
        return (0, _core.core)(getState()).appUsers.init(props);
    };
}