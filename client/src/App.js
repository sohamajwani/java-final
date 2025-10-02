// client/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Layout Component
import MainLayout from './Components/Layout/MainLayout';

// CORRECT PATHS WITH EXPLICIT .js EXTENSION
import Dashboard from './Components/Dashboard.js';
import BookCatalogue from './Components/BookCataloguePage.js'; 
import Members from './Components/Members.js';
import BorrowReturn from './Components/BorrowReturn.js';

import './App.css'; 

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          {/* Redirect root URL to the main catalogue view */}
          <Route path="/" element={<Navigate to="/catalogue" />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/catalogue" element={<BookCatalogue />} />
          <Route path="/members" element={<Members />} />
          <Route path="/borrow-return" element={<BorrowReturn />} />
          
          {/* Adding a route for the 'Search' button from the sidebar, which goes to the catalogue */}
          <Route path="/search" element={<BookCatalogue />} />
          {/* Adding a route for 'Settings' button from the sidebar */}
          <Route path="/settings" element={<Dashboard />} /> 
          
          {/* Fallback route if the path doesn't match anything */}
          <Route path="*" element={<Navigate to="/catalogue" />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;