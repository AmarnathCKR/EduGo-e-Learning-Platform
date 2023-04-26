import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './store/store';
import { ErrorBoundary } from "react-error-boundary";



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ErrorBoundary FallbackComponent={<h1 className='text-red-500 text-center '>Oops Something went wrong.</h1>} onReset={() => {}}>
     <Provider store={store}>
      <App />
     </Provider>
    </ErrorBoundary>
  
);