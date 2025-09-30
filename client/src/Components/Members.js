// client/src/Components/Members.js (Full Working Implementation - Final)

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// --- Imports ---
import MemberCardList from './MemberCardList';
import MemberFilter from './MemberFilter';
import SearchBar from './SearchBar'; 
import Toast from './Toast'; 
import AddBookButton from './Shared/AddBookButton'; 
import AddMemberModal from './Shared/AddMemberModal';

const API_BASE = '/api';

function Members() {
    // ------------------------------------
    // [ALL STATE DECLARATIONS GO HERE]
    // ------------------------------------
    const [members, setMembers] = useState([]);
    const [currentType, setCurrentType] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toast, setToast] = useState({ msg: '', type: '' });
    const [memberToEdit, setMemberToEdit] = useState(null); 
    // ------------------------------------
    
    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast({ msg: '', type: '' }), 3000);
    };

    // ------------------------------------
    // [FETCHING LOGIC]
    // ------------------------------------
    const fetchMembers = useCallback(async (type = null) => {
        try {
            const response = await axios.get(`${API_BASE}/users`);
            
            let filteredMembers = response.data;
            if (type) {
                filteredMembers = response.data.filter(m => 
                    m.type && m.type.toLowerCase() === type.toLowerCase()
                );
            }

            setMembers(filteredMembers);
            setCurrentType(type);
        } catch (error) {
            showToast('Failed to fetch members. Check API.', 'error');
        }
    }, []);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);
    
    // ------------------------------------
    // [CRUD/HANDLER LOGIC]
    // ------------------------------------
    const handleEdit = (member) => {
        setMemberToEdit(member);
        setIsModalOpen(true);
    }

    const handleDelete = async (memberId) => {
        if (!window.confirm("Are you sure you want to delete this member?")) return;
        try {
            const response = await axios.delete(`${API_BASE}/users/${memberId}`);
            showToast(response.data.message, 'success');
            fetchMembers(currentType);
        } catch (error) {
            showToast(error.response?.data?.error || 'Failed to delete member.', 'error');
        }
    }

    const handleSearch = async (query) => {
        if (!query) {
            fetchMembers(null);
            return;
        }
        try {
            const response = await axios.get(`${API_BASE}/users`);
            const lowerQuery = query.toLowerCase();
            const results = response.data.filter(m => 
                m.name.toLowerCase().includes(lowerQuery) || 
                (m.email && m.email.toLowerCase().includes(lowerQuery))
            );

            setMembers(results);
            setCurrentType(null);
        } catch (error) {
            showToast('Search failed.', 'error');
        }
    };
    
    // ------------------------------------
    // [JSX RENDERING]
    // ------------------------------------
    return (
        <div className="member-management-view">
            <div className="catalogue-header">
                <h1 className="catalogue-title">Member Management</h1>
                <p className="catalogue-subtitle">Manage library members and their information</p>
            </div>
            
            {/* 1. ADDED SEARCH HEADING */}
            <h2 className="search-heading catalogue-title">Search Members</h2>

            <SearchBar 
                onSearch={handleSearch} 
                refreshBooks={() => fetchMembers(null)} 
                placeholder="Search members by name or email..."
            />
            
            <MemberFilter 
                currentType={currentType} 
                onFilter={fetchMembers} 
                onAll={() => fetchMembers(null)}
            />
            
            <MemberCardList 
                members={members} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
            />

            {/* 2. CORRECTED BUTTON USAGE (Text is passed as children) */}
            <AddBookButton 
                onClick={() => { setMemberToEdit(null); setIsModalOpen(true); }}
            >
                + Add New Member {/* <--- This is the text used by the corrected component */}
            </AddBookButton>

            <AddMemberModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                showToast={showToast}
                refreshMembers={fetchMembers}
                memberToEdit={memberToEdit}
            />

            <Toast message={toast.msg} type={toast.type} />
        </div>
    );
}

export default Members;