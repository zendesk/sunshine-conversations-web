import { combineReducers } from 'redux';
import { enableBatching } from 'redux-batched-actions';

import ConfigReducer from './config';
import ConversationReducer from './conversation';
import UIReducer from './ui';
import AppStateReducer from './app-state';
import AuthReducer from './auth';
import UserReducer from './user';
import FayeReducer from './faye';
import AppReducer from './app';
import BrowserReducer from './browser';
import IntegrationsReducer from './integrations';

export default enableBatching(combineReducers({
    config: ConfigReducer,
    conversation: ConversationReducer,
    ui: UIReducer,
    appState: AppStateReducer,
    app: AppReducer,
    auth: AuthReducer,
    user: UserReducer,
    faye: FayeReducer,
    browser: BrowserReducer,
    integrations: IntegrationsReducer
}));
