import createLogger from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';

export const createStoreWithMiddleware = applyMiddleware(
  createLogger()
)(createStore);
