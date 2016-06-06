import { combineReducers } from 'redux';

import { ConversationReducer } from './conversation-reducer';
import { UIReducer } from './ui-reducer';
import { AppStateReducer } from './app-state-reducer';
import { AuthReducer } from './auth-reducer';
import { UserReducer } from './user-reducer';
import { FayeReducer } from './faye-reducer';
import { AppReducer } from './app-reducer';
import { BrowserReducer } from './browser-reducer';

export const RootReducer = combineReducers({
    conversation: ConversationReducer,
    ui: UIReducer,
    appState: AppStateReducer,
    app: AppReducer,
    auth: AuthReducer,
    user: UserReducer,
    faye: FayeReducer,
    browser: BrowserReducer
});
