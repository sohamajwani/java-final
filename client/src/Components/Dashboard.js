// client/src/components/Dashboard.js (Full Working Implementation)

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MetricCard from './MetricCard'; 
import Toast from './Toast'; 
import { PlusCircle, Search, BookOpen, Clock, Users } from 'lucide-react'; // Example icons

const API_BASE = '/api';

function Dashboard() {
    const navigate = useNavigate(); 
    
    const [books, setBooks] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState({ msg: '', type: '' });

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast({ msg: '', type: '' }), 3000);
    };

    // --- Navigation Handlers ---
    const handleAddBookClick = () => {
        navigate('/catalogue'); 
    };

    const handleSearchCatalogueClick = () => {
        navigate('/catalogue');
    };
    // ----------------------------

    // --- Data Fetching ---
    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Fetch ALL books (available and borrowed) to calculate metrics
            const [booksRes, notifsRes] = await Promise.all([
                axios.get(`${API_BASE}/books`),
                axios.get(`${API_BASE}/notifications/overdue`),
            ]);
            
            setBooks(booksRes.data);
            setNotifications(notifsRes.data);

        } catch (error) {
            showToast('Failed to load dashboard data.', 'error');
            console.error('Dashboard Fetch Error:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    // --- Metric Calculation (Core Logic) ---
    const totalBooks = books.length;
    const borrowedBooks = books.filter(book => book.available === 0).length;
    const availableBooks = totalBooks - borrowedBooks;
    const overdueBooks = notifications.length; // Already calculated by the notifications API

    if (isLoading) {
        return <h1 className="catalogue-title">Loading Dashboard...</h1>;
    }

    return (
        <div className="dashboard-view">
            <h1 className="catalogue-title">Library Dashboard</h1>
            <p className="catalogue-subtitle">Overview of your library's current status and activities</p>

            {/* --- 1. METRICS CARDS (Flexbox/Grid Layout) --- */}
            <div className="metrics-grid">
                <MetricCard 
                    title="Total Books" 
                    value={totalBooks} 
                    icon={<BookOpen size={24} />} 
                    color="#4b77be" 
                />
                <MetricCard 
                    title="Available Books" 
                    value={availableBooks} 
                    icon={<BookOpen size={24} />} 
                    color="#2ecc71" 
                />
                <MetricCard 
                    title="Borrowed Books" 
                    value={borrowedBooks} 
                    icon={<Users size={24} />} 
                    color="#f39c12" 
                />
                <MetricCard 
                    title="Overdue Books" 
                    value={overdueBooks} 
                    icon={<Clock size={24} />} 
                    color="#e74c3c" 
                />
            </div>
            
            {/* --- 2. ACTIVITY & QUICK ACTIONS (Two-Column Layout) --- */}
            <div className="dashboard-sections">
                
                {/* RECENT ACTIVITY (Updated structure for clean display) */}
<section className="recent-activity-wrapper"> {/* NEW WRAPPER CLASS */}
    <h3 className="section-title">Recent Activity</h3>
    <p className="section-subtitle">Displaying {Math.min(notifications.length, 5)} recent overdue notifications.</p>
    
    <div className="activity-list-container"> {/* New: Container for background */}
        {notifications.slice(0, 5).map((n, idx) => (
            <div key={idx} className="activity-item">
                
                {/* 1. Icon Container (REPLACED Floating Bell) */}
                <div className="activity-icon-wrapper red-dot">
                    <Clock size={16} color="#e74c3c" /> {/* Use a small, fixed red icon */}
                </div>
                
                {/* 2. Structured Text Content */}
                <span className="activity-text-content">
                    {/* Status Line */}
                    <span className="activity-status">
                        <strong className="activity-user-name">{n.user_name}</strong> has not returned 
                        <span className="activity-book-title">{n.title}</span>.
                    </span>
                    {/* Due Date */}
                    <span className="activity-due-date">
                        Due: {String(n.due_date).slice(0, 10)}
                    </span>
                </span>
            </div>
        ))}
        {notifications.length === 0 && (
            <p className="no-activity-message">No recent activity.</p>
        )}
    </div>
</section>
                
                {/* QUICK ACTIONS */}
                <section className="quick-actions">
                    <h3 className="section-title">Quick Actions</h3>
                    <div className="action-button-group">
                        
                        {/* 1. Add New Book Button (Navigates to Catalogue Page) */}
                        <button 
                            className="quick-action-btn primary-action"
                            onClick={handleAddBookClick} 
                        >
                            <PlusCircle size={20} /> Add New Book
                        </button>
                        
                        {/* 2. Search Catalogue Button (Navigates to Catalogue Page) */}
                        <button 
                            className="quick-action-btn secondary-action"
                            onClick={handleSearchCatalogueClick} 
                        >
                            <Search size={20} /> Search Catalogue
                        </button>
                        
                    </div>
                </section>
            </div>

            <Toast message={toast.msg} type={toast.type} />
        </div>
    );
}

export default Dashboard;