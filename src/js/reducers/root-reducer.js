import { combineReducers, applyMiddleware, compose } from 'redux';

import { ConversationReducer } from 'reducers/conversation-reducer';
import { UIReducer } from 'reducers/ui-reducer';
import { AppStateReducer } from 'reducers/app-state-reducer';
import { AuthReducer } from 'reducers/auth-reducer';
import { UserReducer } from 'reducers/user-reducer';
import { FayeReducer } from 'reducers/faye-reducer';

export const RootReducer = combineReducers({
  conversation: ConversationReducer,
  ui: UIReducer,
  appState: AppStateReducer,
  auth: AuthReducer,
  user: UserReducer,
  faye: FayeReducer
});
