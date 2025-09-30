// client/src/Components/BookCardList.js (Updated to pass only existing props)

import React from 'react';
import BookCard from './BookCard';

// We accept all required props
function BookCardList({ books, onEdit, onDelete, onBorrowReturn }) {
    if (books.length === 0) {
        return <p>No books found in the catalogue.</p>;
    }
    
    return (
        <div className="book-list">
            {books.map(book => (
                <BookCard 
                    key={book.id} 
                    book={book} 
                    
                    // CRITICAL FIX: Only pass the prop if the function is defined, 
                    // preventing crashes if a child component relies on receiving it.
                    {...(onEdit && { onEdit })}
                    {...(onDelete && { onDelete })}
                    {...(onBorrowReturn && { onBorrowReturn })}
                />
            ))}
        </div>
    );
}

export default BookCardList;