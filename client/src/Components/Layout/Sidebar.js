// client/src/components/Layout/Sidebar.js

import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: "🏠" },
    { to: "/catalogue", label: "Book Catalogue", icon: "📚" },
    { to: "/members", label: "Members", icon: "👤" },
    { to: "/borrow-return", label: "Borrow & Return", icon: "🔄" },
    { to: "/search", label: "Search", icon: "🔍" },
    { to: "/settings", label: "Settings", icon: "⚙️" },
];

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo">LibraryPro</div>
      <div className="nav-list">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => "nav-item " + (isActive ? "active" : "")}
          >
            {item.icon} {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;