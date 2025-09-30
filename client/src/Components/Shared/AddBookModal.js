// client/src/components/Shared/AddBookModal.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = '/api';

function AddBookModal({ isOpen, onClose, showToast, refreshBooks, genres, bookToEdit }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const isEditing = !!bookToEdit;

  useEffect(() => {
      if (isEditing) {
          setTitle(bookToEdit.title);
          setAuthor(bookToEdit.author);
          setGenre(bookToEdit.genre || '');
      } else {
          setTitle('');
          setAuthor('');
          setGenre('');
      }
  }, [bookToEdit, isEditing]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !author) return showToast('Title and Author are required.', 'error');
    
    const payload = { title, author, genre: genre || 'Uncategorized' };
    const endpoint = isEditing ? `${API_BASE}/books/${bookToEdit.id}` : `${API_BASE}/books`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await axios({ url: endpoint, method, data: payload });
      
      showToast(response.data.message, 'success');
      onClose(); // Close the modal
      refreshBooks(null, true); // Refresh list
    } catch (error) {
      const msg = error.response?.data?.error || `Failed to ${isEditing ? 'update' : 'add'} book.`;
      showToast(msg, 'error');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>{isEditing ? 'Edit Book' : 'Add New Book'}</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
          
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="">Select Genre</option>
            {(genres || []).map(g => (<option key={g} value={g}>{g}</option>))}
          </select>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
            <button type="submit" className="btn-primary">{isEditing ? 'Save Changes' : 'Add Book'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBookModal;