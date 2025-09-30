// client/src/components/Layout/MainLayout.js (The correct structure)

import React from 'react';
import Sidebar from './Sidebar'; // MUST be imported and used
import Header from './Header';   // MUST be imported and used

function MainLayout({ children }) {
  return (
    // 1. CRITICAL: This container needs 'display: flex' in App.css
    <div className="library-app"> 
      
      <Sidebar /> {/* 2. Sidebar component */}
      
      {/* 3. Main content wrapper takes up the rest of the space */}
      <main className="main-content">
        <Header /> {/* Your correct Header component */}
        
        <div className="page-wrapper">
          {children} {/* This renders the actual page (BookCataloguePage) */}
        </div>
      </main>
      
    </div>
  );
}

export default MainLayout;