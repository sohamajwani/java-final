// client/src/components/Layout/Header.js

import React from 'react';

function Header() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="main-header">
      <div className="greeting">
        <h2>Good Morning, Librarian!</h2>
        <p>Today is {currentDate}</p>
      </div>
      <div className="user-info">
        <span className="notification">🔔</span>
        <div className="user-profile">
          <span className="user-name">Sarah Johnson</span>
          <span className="user-title">Head Librarian</span>
          <img className="user-avatar" src="https://via.placeholder.com/40" alt="Sarah" />
        </div>
      </div>
    </header>
  );
}

export default Header;