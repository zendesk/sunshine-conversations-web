import { createStore } from 'redux';

export function getMockedStore(sinon, mockedState = {}) {
  return createStore((state, action) => mockedState); 
}
