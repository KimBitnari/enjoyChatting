import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Test1 from './test1';
import LoginTest from './LoginTest';
import LoginTest2 from './LoginTest2';
import Routes from './Routes';
import reportWebVitals from './reportWebVitals';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import configureStore from './config/store';
const {store, persistor} = configureStore();

ReactDOM.render(
  // <React.StrictMode>
  //   {/* <Test1 /> */}
  //   {/* <LoginTest /> */}
  //   {/* <LoginTest2 /> */}

  //   <App />
  // </React.StrictMode>,
  
  // Provider에 쌓여있는 부분은 redux에 store에 접근 가능 => 즉, appState에 접근이 가능하다
  // 우리의 모든 컴포넌트가 그렇게 되도록 가장 상위단에 Provider를 선언해주면 됩니다.
  // Provider = 제공하는 주체
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Routes />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
