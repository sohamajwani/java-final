// client/src/Components/BookCardList.js

import React from 'react';
import BookCard from './BookCard';

// Added onBorrowReturn prop
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
          onEdit={onEdit}
          onDelete={onDelete}
          onBorrowReturn={onBorrowReturn} // <-- PASSING THE HANDLER DOWN
        />
      ))}
    </div>
  );
}

export default BookCardList;