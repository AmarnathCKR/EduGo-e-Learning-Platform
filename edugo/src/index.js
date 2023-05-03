import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './store/store';
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from './helper/ErrorPage';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ErrorBoundary FallbackComponent={<ErrorPage title="Something Went Wrong" />} onReset={() => {}}>
     <Provider store={store}>
      <App />
     </Provider>
    </ErrorBoundary>
  
);