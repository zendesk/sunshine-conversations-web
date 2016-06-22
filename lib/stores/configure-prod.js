'use strict';

exports.__esModule = true;
exports.configureStore = configureStore;

var _redux = require('redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _rootReducer = require('../reducers/root-reducer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createStoreWithMiddleware = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore);

function configureStore(initialState) {
    return createStoreWithMiddleware(_rootReducer.RootReducer, initialState);
}