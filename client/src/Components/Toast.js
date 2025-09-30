// client/src/components/Toast.js

import React from 'react';

function Toast({ message, type }) {
  const toastClass = `toast ${message ? 'show' : ''} ${type}`;
  
  return (
    <div id="toast" className={toastClass}>
      {message}
    </div>
  );
}

export default Toast;