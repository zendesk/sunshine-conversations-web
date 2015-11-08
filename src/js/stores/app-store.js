import { combineReducers, applyMiddleware, compose } from 'redux';
import { devTools } from 'redux-devtools';

import { createStoreWithMiddleware } from './';
import { ConversationReducer } from '../reducers/conversation-reducer';
import { UIReducer } from '../reducers/ui-reducer';
import { AppStateReducer } from '../reducers/app-state-reducer';


const reducer = combineReducers({
  conversation: ConversationReducer,
  ui: UIReducer,
  appState: AppStateReducer
});

export const store = compose(
  devTools()
)(createStoreWithMiddleware)(reducer);
