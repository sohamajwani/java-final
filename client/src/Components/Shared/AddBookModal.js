// client/src/components/Shared/AddBookModal.js (FINALIZED CODE with Aesthetic Structure)

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
            <div className="modal-content modal-align-center" onClick={e => e.stopPropagation()}>
                
                {/* 1. ADDED CLASS FOR STYLED TITLE */}
                <h3 className="modal-title">{isEditing ? 'Edit Book Details' : 'Add New Book'}</h3> 
                
                {/* 2. ADDED CLASS FOR FORM STRUCTURE */}
                <form onSubmit={handleSubmit} className="modal-form-grid"> 
                    
                    <div className="input-group"> {/* Wrapper for uniform styling */}
                        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    
                    <div className="input-group">
                        <input type="text" placeholder="Author Name" value={author} onChange={(e) => setAuthor(e.target.value)} required />
                    </div>
                    
                    <div className="input-group">
                        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
                            <option value="">Select Genre</option>
                            {(genres || []).map(g => (<option key={g} value={g}>{g}</option>))}
                        </select>
                    </div>

                    <div className="modal-actions">
                        {/* 3. STYLED BUTTONS using established classes */}
                        <button type="button" onClick={onClose} className="btn-cancel action-btn">Cancel</button>
                        <button type="submit" className="btn-primary action-btn">
                            {isEditing ? 'Save Changes' : 'Add Book'}
                        </button>
                    </div>
                </form>
                
            </div>
        </div>
    );
}

export default AddBookModal;