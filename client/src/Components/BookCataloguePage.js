// client/src/Components/BookCataloguePage.js (Finalized Code)

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// --- Imports from the same folder (./) ---
import BookCardList from './BookCardList'; 
import GenreFilter from './GenreFilter'; 
import SearchBar from './SearchBar'; 
import Toast from './Toast'; 
import UserSelect from './UserSelect'; // <-- IMPORTED USER SELECT

// --- Imports from the Shared sub-folder ---
import AddBookButton from './Shared/AddBookButton'; 
import AddBookModal from './Shared/AddBookModal';

const API_BASE = '/api';

function BookCataloguePage() {
    // --- STATE ADDITIONS ---
    const [books, setBooks] = useState([]);
    const [genres, setGenres] = useState([]);
    const [users, setUsers] = useState([]); // <-- ADDED STATE
    const [selectedUserId, setSelectedUserId] = useState(''); // <-- ADDED STATE (starts empty)
    const [currentGenre, setCurrentGenre] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toast, setToast] = useState({ msg: '', type: '' });
    const [editBook, setEditBook] = useState(null); 
    // ------------------------

    // --- Utility Functions ---
    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast({ msg: '', type: '' }), 3000);
    };
    
    // --- Data Fetching ---
    const fetchBooks = useCallback(async (genre = null, isSearch = false) => {
        try {
            let url = `${API_BASE}/books`;
            if (genre && !isSearch) {
                url += `?genre=${encodeURIComponent(genre)}`;
            }
            const response = await axios.get(url);
            setBooks(response.data);
            setCurrentGenre(genre);
        } catch (error) {
            showToast('Failed to fetch books.', 'error');
        }
    }, []);

    // --- UPDATED useEffect to fetch users ---
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch genres and users concurrently
                const [genresRes, usersRes] = await Promise.all([
                    axios.get(`${API_BASE}/genres`),
                    axios.get(`${API_BASE}/users`), // <-- FETCHING USERS
                ]);
                setGenres(genresRes.data);
                setUsers(usersRes.data); // <-- SETTING USERS
                
                // Set the selectedUserId to the first user if the list isn't empty, otherwise keep it empty.
                if (usersRes.data.length > 0) {
                    setSelectedUserId(usersRes.data[0].id);
                }

                fetchBooks(); // Fetch all books initially
            } catch (error) {
                showToast('Failed to load initial data. Check DB connection.', 'error');
            }
        };
        fetchInitialData();
    }, [fetchBooks]);

    // --- CRUD Actions ---
    const handleEdit = (book) => {
        setEditBook(book);
        setIsModalOpen(true);
    }

    const handleDelete = async (bookId) => {
        if (!window.confirm("Are you sure you want to delete this book?")) return;
        try {
            const response = await axios.delete(`${API_BASE}/books/${bookId}`);
            showToast(response.data.message, 'success');
            fetchBooks(currentGenre);
        } catch (error) {
            showToast(error.response?.data?.error || 'Failed to delete book.', 'error');
        }
    }

    const handleSearch = async (query) => {
        if (!query) {
            fetchBooks(null);
            return;
        }
        try {
            const url = `${API_BASE}/search?q=${encodeURIComponent(query)}`;
            const response = await axios.get(url);
            setBooks(response.data);
            setCurrentGenre(null); 
        } catch (error) {
            showToast('Search failed.', 'error');
        }
    };
    
    // --- Borrow/Return Handler (FINAL LOGIC) ---
    const handleBorrowReturn = async (endpoint, bookId) => {
        const userId = selectedUserId; // <-- USING SELECTED USER ID

        if (endpoint === 'borrow' && !userId) {
            showToast('Please select a user to borrow a book.', 'error');
            return;
        }

        try {
            const payload = endpoint === 'borrow' ? 
                { book_id: bookId, user_id: userId } : 
                { book_id: bookId };

            const response = await axios.post(`${API_BASE}/${endpoint}`, payload);
            
            showToast(response.data.message, 'success');
            fetchBooks(currentGenre); // Refresh list
        } catch (error) {
            const msg = error.response?.data?.error || `Action failed: ${endpoint}`;
            showToast(msg, 'error');
        }
    };
    // ---------------------------------------------


    return (
        <div className="catalogue-view">
            <div className="catalogue-header">
                <h1 className="catalogue-title">Book Catalogue</h1>
                <p className="catalogue-subtitle">Manage your library's book collection</p>
            </div>
            
            {/* ADDED USER SELECT COMPONENT */}
            <UserSelect 
                users={users} 
                selectedUserId={selectedUserId} 
                setSelectedUserId={setSelectedUserId} 
            />

            <SearchBar onSearch={handleSearch} refreshBooks={() => fetchBooks(null)} />
            
            <GenreFilter 
                genres={genres} 
                currentGenre={currentGenre} 
                onFilter={fetchBooks} 
                onAll={() => fetchBooks(null)}
            />
            
            <BookCardList 
                books={books} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
                onBorrowReturn={handleBorrowReturn} 
            />

            <AddBookButton onClick={() => { setEditBook(null); setIsModalOpen(true); }} />

            <AddBookModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                showToast={showToast}
                refreshBooks={fetchBooks}
                genres={genres}
                bookToEdit={editBook}
            />

            <Toast message={toast.msg} type={toast.type} />
        </div>
    );
}

export default BookCataloguePage;