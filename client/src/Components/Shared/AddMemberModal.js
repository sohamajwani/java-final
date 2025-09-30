// client/src/components/Shared/AddMemberModal.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = '/api';

function AddMemberModal({ isOpen, onClose, showToast, refreshMembers, memberToEdit }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [type, setType] = useState('Member');
    const isEditing = !!memberToEdit;
    
    // Member Types for the dropdown
    const memberTypes = ["Member", "Student", "Faculty", "Public"];

    useEffect(() => {
        if (isEditing) {
            setName(memberToEdit.name);
            setEmail(memberToEdit.email);
            setType(memberToEdit.type || 'Member');
        } else {
            setName('');
            setEmail('');
            setType('Member');
        }
    }, [memberToEdit, isEditing]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email) return showToast('Name and Email are required.', 'error');
        
        const payload = { name, email, type };
        const endpoint = isEditing ? `${API_BASE}/users/${memberToEdit.id}` : `${API_BASE}/users`;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await axios({ url: endpoint, method, data: payload });
            
            showToast(response.data.message, 'success');
            onClose(); 
            refreshMembers(null, true); 
        } catch (error) {
            const msg = error.response?.data?.error || `Failed to ${isEditing ? 'update' : 'add'} member.`;
            showToast(msg, 'error');
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h3>{isEditing ? 'Edit Member' : 'Add New Member'}</h3>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                    <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        {memberTypes.map(t => (<option key={t} value={t}>{t}</option>))}
                    </select>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
                        <button type="submit" className="btn-primary">{isEditing ? 'Save Changes' : 'Add Member'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddMemberModal;