import React from 'react';
import { Provider } from 'react-redux'
import store from './store';
import { HomePage } from './pages/home';

export default function App() {
  return (
    <Provider store={store}>
      <HomePage />
    </Provider>
  );
}

