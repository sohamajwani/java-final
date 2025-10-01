// client/src/Components/BorrowReturn.js (Final Code with Overdue/Active Split)

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import BookCardList from './BookCardList';
import Toast from './Toast';

const API_BASE = '/api';

function BorrowReturn() {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [toast, setToast] = useState({ msg: '', type: '' });
    
    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast({ msg: '', type: '' }), 3000);
    };

    const fetchBorrowedBooks = useCallback(async () => {
        try {
            // CRITICAL: Fetch books with available=false (i.e., borrowed books)
            const url = `${API_BASE}/books?available=false`; 
            const response = await axios.get(url);
            setBorrowedBooks(response.data);
        } catch (error) {
            showToast('Failed to fetch borrowed books.', 'error');
        }
    }, []);

    useEffect(() => {
        fetchBorrowedBooks();
    }, [fetchBorrowedBooks]);

    // --- Return Handler ---
    const handleReturn = async (bookId) => {
        try {
            // API call to return the book
            const response = await axios.post(`${API_BASE}/return`, { book_id: bookId });
            showToast(response.data.message, 'success');
            
            // CRITICAL: Refresh this list to remove the returned book
            fetchBorrowedBooks(); 
        } catch (error) {
            const msg = error.response?.data?.error || `Failed to return book.`;
            showToast(msg, 'error');
        }
    };
    
    // --- NEW: Due Date Modification Handler (With Past Date Validation) ---
    const handleModifyDueDate = async (bookId, currentDueDate) => {
        const newDateString = window.prompt(`Enter new return date for Book ID ${bookId} (YYYY-MM-DD):`, currentDueDate);
        
        // 1. Basic Format and Cancel Check
        if (!newDateString || newDateString.length !== 10 || newDateString.indexOf('-') === -1) {
            if (newDateString) showToast("Modification canceled or invalid date format (Use YYYY-MM-DD).", 'error');
            return;
        }

        // --- 2. CRITICAL DATE VALIDATION ---
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const parts = newDateString.split('-');
        const submittedDate = new Date(parts[0], parts[1] - 1, parts[2]); 

        if (submittedDate < today) {
            showToast("Error: Due date cannot be set to a date in the past.", 'error');
            return;
        }
        
        // 3. Format Date for API (Ensures the YYYY-MM-DD format is clean)
        const yyyy = submittedDate.getFullYear();
        const mm = String(submittedDate.getMonth() + 1).padStart(2, '0');
        const dd = String(submittedDate.getDate()).padStart(2, '0');
        const newDate = `${yyyy}-${mm}-${dd}`; 

        try {
            const response = await axios.put(`${API_BASE}/loan/${bookId}`, { new_due_date: newDate });
            showToast(response.data.message, 'success');
            fetchBorrowedBooks(); 
        } catch (error) {
            showToast(error.response?.data?.error || 'Failed to update due date.', 'error');
        }
    };
    // ------------------------------------------

    // --- Data is fetched into borrowedBooks array (all borrowed items) ---
    // 1. Filter borrowedBooks into two lists based on the 'overdue' flag from the API
    const overdueBooks = borrowedBooks.filter(book => book.overdue === 1);
    const activeBooks = borrowedBooks.filter(book => book.overdue === 0);
    
    // 2. Define action props (needed by BookCardList and BookCard)
    const actionProps = {
        // Placeholder functions for Edit/Delete on this page
        onEdit: (book) => showToast('Edit is not available on the Active Loans page.', 'info'),
        onDelete: (bookId) => showToast('Deletion is not available on the Active Loans page.', 'info'),
        
        // Actual handlers for this page
        onBorrowReturn: (action, id) => {
            if (action === 'return') {
                handleReturn(id);
            }
        },
        onModifyDueDate: handleModifyDueDate, // <-- NEW PROP ADDED
    };

    return (
        <div className="borrow-return-view">
            
            {/* 1. OVERDUE SECTION (New) */}
            {overdueBooks.length > 0 && (
                <section className="overdue-section">
                    <h1 className="catalogue-title overdue-title">🚨 Overdue Items ({overdueBooks.length})</h1>
                    <p className="catalogue-subtitle">These items must be returned immediately.</p>
                    <BookCardList 
                        books={overdueBooks}
                        {...actionProps}
                    />
                </section>
            )}

            {/* 2. ACTIVE LOANS SECTION */}
            {/* Adjust margin only if Overdue section is hidden */}
            <section className="active-loans-section" style={{ marginTop: overdueBooks.length > 0 ? '40px' : '0' }}>
                <h1 className="catalogue-title">🔄 Active Loans ({activeBooks.length})</h1>
                <p className="catalogue-subtitle">Items currently checked out and due for return.</p>
                
                {/* Show no books message ONLY if both lists are empty */}
                {activeBooks.length === 0 && overdueBooks.length === 0 ? (
                    <p>No books are currently checked out.</p>
                ) : (
                    <BookCardList 
                        books={activeBooks}
                        {...actionProps}
                    />
                )}
            </section>
            
            <Toast message={toast.msg} type={toast.type} />
        </div>
    );
}

export default BorrowReturn;