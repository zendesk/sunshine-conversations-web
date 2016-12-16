'use strict';

exports.__esModule = true;
exports.login = login;

var _core = require('./core');

function login(props) {
    return (0, _core.core)().appUsers.init(props);
}