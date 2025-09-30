// client/src/components/AddBookForm.js

import React, { useState } from 'react';
import axios from 'axios';

function AddBookForm({ API_BASE, showToast, refreshBooks, genres }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !author) {
      showToast('Title and Author are required.', 'error');
      return;
    }

    try {
      const payload = { title, author, genre: genre || 'Uncategorized' };
      const response = await axios.post(`${API_BASE}/books`, payload);
      
      showToast(response.data.message, 'success');
      setTitle('');
      setAuthor('');
      setGenre('');
      refreshBooks();
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to add book.';
      showToast(msg, 'error');
    }
  };

  return (
    <section className="form-section">
      <h2>Add a New Book</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Book Title" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required 
        />
        <input 
          type="text" 
          placeholder="Author Name" 
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required 
        />
        <select 
          value={genre} 
          onChange={(e) => setGenre(e.target.value)}
        >
          <option value="">Select Genre (Optional)</option>
          {
            // FIX: Use (genres || []) to ensure .map() is called on an array,
            // even if the genres prop hasn't loaded (is undefined) yet.
            (genres || []).map(g => ( 
              <option key={g} value={g}>{g}</option>
            ))
          }
        </select>
        <button type="submit">Add Book</button>
      </form>
    </section>
  );
}

export default AddBookForm;