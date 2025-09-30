// client/src/Components/BookCardList.js (Updated to pass onModifyDueDate)

import React from 'react';
import BookCard from './BookCard';

// MODIFIED: Accepts the new onModifyDueDate prop
function BookCardList({ books, onEdit, onDelete, onBorrowReturn, onModifyDueDate }) {
    if (books.length === 0) {
        return <p>No books found in the catalogue.</p>;
    }
    
    return (
        <div className="book-list">
            {books.map(book => (
                <BookCard 
                    key={book.id} 
                    book={book} 
                    
                    // Passing all action handlers directly to the child card
                    onEdit={onEdit} 
                    onDelete={onDelete}
                    onBorrowReturn={onBorrowReturn}
                    
                    // CRITICAL: Passing the new prop
                    onModifyDueDate={onModifyDueDate} 
                />
            ))}
        </div>
    );
}

export default BookCardList;