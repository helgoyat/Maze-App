import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Global variables
window.$maxSize = 7;
window.$minSize = 2;

ReactDOM.render(<App />, document.getElementById('root'));