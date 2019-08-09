import React, { Component } from 'react';
import { AppRegistry } from 'react-native';

import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import App from './js/App';
import rootReducer from './js/redux/reducers';
const middlewares = [thunk];

let store = createStore(rootReducer, applyMiddleware(...middlewares));

export default class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    )
  }
}

AppRegistry.registerComponent('recharge_my_party', () => Root);
AppRegistry.registerComponent('ViroSample', () => Root);
