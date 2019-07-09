import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

ReactDOM.hydrate(<App initialState = {window.initialState} />, document.getElementById('app'));
