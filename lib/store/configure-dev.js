'use strict';

exports.__esModule = true;
exports.configureStore = configureStore;

var _redux = require('redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _rootReducer = require('../reducers/root-reducer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var finalCreateStore = (0, _redux.compose)((0, _redux.applyMiddleware)(_reduxThunk2.default), window.devToolsExtension ? window.devToolsExtension() : function (f) {
    return f;
})(_redux.createStore);

function configureStore(initialState) {
    var store = finalCreateStore(_rootReducer.RootReducer, initialState);

    if (module.hot) {
        module.hot.accept('../reducers/root-reducer', function () {
            return store.replaceReducer(require('../reducers/root-reducer').RootReducer);
        });
    }

    return store;
}