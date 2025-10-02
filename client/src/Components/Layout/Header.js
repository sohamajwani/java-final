// client/src/Components/Layout/Header.js (Final Corrected Code)

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Bell, LogOut, User } from "lucide-react"; // npm install lucide-react

// Helper function to format the MySQL date string to prevent time zone shift errors
const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'N/A';
    
    // We expect YYYY-MM-DD format from the server's due_date field
    const parts = dateString.toString().slice(0, 10).split('-');
    
    // Use Date(year, monthIndex, day) to force local interpretation (preventing UTC shift)
    // Note: monthIndex is 0-indexed, so we subtract 1 from the month part
    const localDate = new Date(parts[0], parts[1] - 1, parts[2]); 
    
    // Format locally for display (e.g., 10/2/2025)
    return localDate.toLocaleDateString();
};


function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isExpandedView, setIsExpandedView] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const notificationRef = useRef(null);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Fetch overdue notifications
  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await axios.get("/api/notifications/overdue");
        setNotifications(res.data);
        setUnreadCount(res.data.length); // show number of overdue books
      } catch (err) {
        // Silently fail if notifications cannot be fetched
        console.error("Failed to fetch notifications:", err.message); 
      }
    }
    fetchNotifications();
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
    if (!isDropdownOpen) {
      // Mark as read when opening
      setUnreadCount(0);
    }
    if (isExpandedView) setIsExpandedView(false);
  };

  const closePanel = () => {
    setIsDropdownOpen(false);
    setIsExpandedView(false);
  };

  const panelClass = isExpandedView
    ? "notification-panel expanded-view"
    : "notification-panel dropdown-mode";

  return (
    <header className="main-header">
      <div className="greeting">
        <h2>Good Morning, Librarian!</h2>
        <p>Today is {currentDate}</p>
      </div>

      <div className="user-info">
        {/* 🔔 Notification Icon */}
        <div className="notification-container" ref={notificationRef}>
          <button
            className="notification-icon clickable"
            onClick={toggleDropdown}
            aria-expanded={isDropdownOpen}
            aria-controls="notification-panel"
            title="Notifications"
          >
            <Bell size={22} color="#d9534f" />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {isDropdownOpen && (
            <div id="notification-panel" className={panelClass} role="dialog">
              <div className="panel-header">
                <h3>
                  {isExpandedView ? "All Notifications" : "Recent Notifications"}
                </h3>
                <button onClick={closePanel} className="close-btn">
                  &times;
                </button>
              </div>
              <div className="panel-content">
                
                {notifications.length > 0 ? (
                  notifications.map((n, idx) => (
                    <div key={idx} className="notification-item">
                      <span className="dot overdue"></span>
                      
                      {/* Structured wrapper for clean layout */}
                      <div className="notification-text-wrapper"> 
                        {/* User and Status (safely converted to string) */}
                        {String(n.user_name)} has not returned 
                        
                        {/* Book Title (Bold and separate line via CSS) */}
                        <b>{String(n.title)}</b>
                        
                        {/* Due Date (uses new formatting helper) */}
                        <span className="due-date-text">
                          Due: {formatDateForDisplay(n.due_date)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="notification-item">
                    ✅ No overdue books currently.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 👤 User Profile + Logout */}
        <div className="user-profile">
          <User className="profile-icon" size={28} color="#f39c12" />
          <span className="user-name">Sarah Johnson</span>
          <span className="user-title">Head Librarian</span>
          <button className="logout-btn">
            <LogOut size={20} color="#f39c12" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;