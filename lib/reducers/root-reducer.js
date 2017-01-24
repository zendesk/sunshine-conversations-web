'use strict';

exports.__esModule = true;
exports.RootReducer = undefined;

var _redux = require('redux');

var _reduxBatchedActions = require('redux-batched-actions');

var _conversationReducer = require('./conversation-reducer');

var _uiReducer = require('./ui-reducer');

var _appStateReducer = require('./app-state-reducer');

var _authReducer = require('./auth-reducer');

var _userReducer = require('./user-reducer');

var _fayeReducer = require('./faye-reducer');

var _appReducer = require('./app-reducer');

var _browserReducer = require('./browser-reducer');

var _integrationsReducer = require('./integrations-reducer');

var RootReducer = exports.RootReducer = (0, _reduxBatchedActions.enableBatching)((0, _redux.combineReducers)({
    conversation: _conversationReducer.ConversationReducer,
    ui: _uiReducer.UIReducer,
    appState: _appStateReducer.AppStateReducer,
    app: _appReducer.AppReducer,
    auth: _authReducer.AuthReducer,
    user: _userReducer.UserReducer,
    faye: _fayeReducer.FayeReducer,
    browser: _browserReducer.BrowserReducer,
    integrations: _integrationsReducer.IntegrationsReducer
}));