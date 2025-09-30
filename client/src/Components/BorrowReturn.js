// client/src/Components/BorrowReturn.js (Final Code with Due Date Modification Logic)

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
    
    // --- NEW: Due Date Modification Handler ---
    const handleModifyDueDate = async (bookId, currentDueDate) => {
        const newDate = window.prompt(`Enter new return date for Book ID ${bookId} (YYYY-MM-DD):`, currentDueDate);
        
        // Check if the user clicked cancel or entered an invalid format
        // Simple validation checks for null/empty and ensures the length is 10 (like 2025-01-01)
        if (!newDate || newDate.length !== 10 || newDate.indexOf('-') === -1) {
            if (newDate) showToast("Modification canceled or invalid date format (Use YYYY-MM-DD).", 'error');
            return;
        }

        try {
            const response = await axios.put(`${API_BASE}/loan/${bookId}`, { new_due_date: newDate });
            showToast(response.data.message, 'success');
            fetchBorrowedBooks(); // Refresh list to show new date
        } catch (error) {
            showToast(error.response?.data?.error || 'Failed to update due date.', 'error');
        }
    };
    // ------------------------------------------

    // --- Modify Props for BookCardList (FIXED CRASH) ---
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
            <h1 className="catalogue-title">🔄 Active Loans</h1>
            <p className="catalogue-subtitle">Items currently checked out and due for return.</p>

            {/* CRITICAL: Check if the list is an array before mapping (extra safety) */}
            {(!Array.isArray(borrowedBooks) || borrowedBooks.length === 0) ? (
                <p>No books are currently borrowed.</p>
            ) : (
                <BookCardList 
                    books={borrowedBooks}
                    // Pass all action handlers, including the new due date modifier
                    {...actionProps} 
                />
            )}
            <Toast message={toast.msg} type={toast.type} />
        </div>
    );
}

export default BorrowReturn;