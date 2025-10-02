// client/src/Components/Layout/Header.js
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Bell, LogOut, User } from "lucide-react"; // npm install lucide-react

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
                      {n.user_name} has not returned <b>{n.title}</b> (due{" "}
                      {new Date(n.due_date).toLocaleDateString()}).
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