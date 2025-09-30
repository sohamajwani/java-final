// client/src/index.js (Simplified and Corrected)

import React from 'react';
import ReactDOM from 'react-dom/client';
// ❌ REMOVE the line that imports './index.css'
import './App.css'; // ✅ Import your main application CSS file
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ❌ Also ensure you remove the import and usage of reportWebVitals if it was there.