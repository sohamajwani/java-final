// client/src/Components/BookCard.js (FINALIZED CODE with Overdue Status)

import React from 'react';

// Helper function to format the MySQL date string (YYYY-MM-DD HH:MM:SS)
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    // Cuts off the time (first 10 characters are YYYY-MM-DD)
    return dateString.toString().slice(0, 10); 
};

// MODIFIED: Added onModifyDueDate to props
function BookCard({ book, onEdit, onDelete, onBorrowReturn, onModifyDueDate }) { 
    
    // 1. Determine availability status
    const isAvailable = book.available === 1; 
    
    // NEW CRITICAL CHECK: Determine if the book is overdue (1 = overdue, 0 = active loan)
    const isOverdue = book.overdue === 1; 

    // Define the card's class name, applying the 'overdue' class if necessary
    const cardClass = `book-card ${isOverdue ? 'overdue' : ''}`; // <--- APPLIES FLASHING CSS
    
    // 2. Define the action button based on availability
    const actionButton = isAvailable ? (
        <button className="btn-borrow" onClick={() => onBorrowReturn('borrow', book.id)}>
            Borrow
        </button>
    ) : (
        <button className="btn-return" onClick={() => onBorrowReturn('return', book.id)}>
            Return
        </button>
    );
    
    // Define unique gradient colors based on the book's availability for visual flair (Optional)
    const colorStyle = isAvailable 
        ? 'linear-gradient(135deg, #a8c0ff, #3f2b96)' // Blue/Purple for available
        : 'linear-gradient(135deg, #ffb3b3, #cc0000)'; // Red/Pink for borrowed

    return (
        <div className={cardClass}> {/* Use the conditional class here */}
            <div className="card-top-bar" style={{ background: colorStyle }}>
                 {/* Icons for Edit/Delete */}
                 <div className="card-icons">
                     <button className="card-icon-btn" onClick={() => onEdit(book)}>✏️</button>
                     <button className="card-icon-btn" onClick={() => onDelete(book.id)}>🗑️</button>
                 </div>
                 {/* Placeholder for book image or icon */}
                 <span className="book-icon">📖</span> 
                 <span className="genre-tag">{book.genre || 'N/A'}</span>
            </div>
            
            <div className="card-content">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by <em>{book.author}</em></p>
                
                <div className="actions">
                    {actionButton} {/* Render the conditional Borrow/Return button */}
                </div>
                
                {/* Display Loan Status and Due Date ONLY if NOT available */}
                {!isAvailable && book.borrowed_by && (
                    <div className="borrow-status-info">
                        
                        {/* Display "OVERDUE" message if applicable */}
                        {isOverdue && <p style={{ color: '#e74c3c', fontWeight: 'bold' }}>OVERDUE!</p>}
                        
                        <p>Borrowed by: <strong>{book.borrowed_by}</strong></p>
                        
                        {book.due_date && (
                            <div className="due-date-container">
                                <p className="due-date">Due: 
                                    {/* Highlight the due date in red if overdue */}
                                    <strong style={{ color: isOverdue ? '#e74c3c' : 'var(--color-primary)' }}> {formatDate(book.due_date)}</strong>
                                </p>
                                
                                {/* Modification Button */}
                                <button 
                                    className="modify-date-btn"
                                    onClick={() => onModifyDueDate(book.id, formatDate(book.due_date))}
                                >
                                    ✏️
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BookCard;