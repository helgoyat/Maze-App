import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Global variables
window.$maxMazeSize = 7;
window.$minMazeSize = 2;

ReactDOM.render(<App />, document.getElementById('root'));