// client/src/Components/Shared/AddBookButton.js (FINAL CORRECT CODE)

import React from 'react';

// Accept 'children' as a prop
function AddBookButton({ onClick, children }) { 
    return (
        <button className="add-book-btn" onClick={onClick}>
            {/* Use the children prop. If it's empty, default to the book text. */}
            {children || "+ Add New Book"} 
        </button>
    );
}

export default AddBookButton;