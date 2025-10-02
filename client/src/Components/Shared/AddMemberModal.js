// client/src/components/Shared/AddMemberModal.js (FINALIZED CODE with Aesthetic Structure)

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
            onClose(); // Close the modal
            refreshMembers(null, true); 
        } catch (error) {
            const msg = error.response?.data?.error || `Failed to ${isEditing ? 'update' : 'add'} member.`;
            showToast(msg, 'error');
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            {/* CRITICAL: Added class for centering and structure */}
            <div className="modal-content modal-align-center" onClick={e => e.stopPropagation()}>
                
                {/* 1. Styled Title */}
                <h3 className="modal-title">{isEditing ? 'Edit Member Details' : 'Add New Member'}</h3> 
                
                {/* 2. Added Class for Form Structure */}
                <form onSubmit={handleSubmit} className="modal-form-grid"> 
                    
                    {/* Input Group 1 (Full Name) */}
                    <div className="input-group"> 
                        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    
                    {/* Input Group 2 (Email) */}
                    <div className="input-group">
                        <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    
                    {/* Input Group 3 (Select Type) */}
                    <div className="input-group">
                        <select value={type} onChange={(e) => setType(e.target.value)}>
                            {memberTypes.map(t => (<option key={t} value={t}>{t}</option>))}
                        </select>
                    </div>

                    <div className="modal-actions">
                        {/* 3. Styled buttons using established classes */}
                        <button type="button" onClick={onClose} className="btn-cancel action-btn">Cancel</button>
                        <button type="submit" className="btn-primary action-btn">
                            {isEditing ? 'Save Changes' : 'Add Member'}
                        </button>
                    </div>
                </form>
                
            </div>
        </div>
    );
}

export default AddMemberModal;