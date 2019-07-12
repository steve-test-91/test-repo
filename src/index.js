import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';


import './parse';
import App from './components/App';
import * as serviceWorker from './serviceWorker';



Sentry.init({
  dsn: 'https://39288570fd1e4d5fa42c8d06959ac98b@sentry.io/1499915'
});


ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
