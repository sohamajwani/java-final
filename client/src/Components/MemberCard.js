// client/src/Components/MemberCard.js (CORRECTED)

import React from 'react';

function MemberCard({ member, onEdit, onDelete }) {
    // We assume the API does *not* provide active_borrows, so we display 'N/A' 
    // unless you modify the backend.
    
    return (
        <div className="member-card">
            <div className="card-header">
                <span className={`member-type-tag tag-${member.type ? member.type.toLowerCase() : 'member'}`}>
                    {member.type || 'Member'}
                </span>
                <div className="card-icons">
                    <button className="card-icon-btn" onClick={() => onEdit(member)}>✏️</button>
                    <button className="card-icon-btn" onClick={() => onDelete(member.id)}>🗑️</button>
                </div>
            </div>

            <div className="card-content">
                <h3 className="member-name">👤 {member.name}</h3>
                
                {/* FIX 1: CORRECTLY DISPLAYING EMAIL */}
                <p className="member-detail">📧 {member.email || 'N/A'}</p> 
                
                {/* Assuming you add address/phone to your users table later */}
                {/* <p className="member-detail">📞 {member.phone || 'N/A'}</p> */}
                {/* <p className="member-detail">🏠 {member.address || 'N/A'}</p> */}
            </div>

            <div className="card-footer">
                <p>Member ID: {member.id}</p>
                
                {/* FIX 2: REMOVING HARDCODED '0' AND DISPLAYING PLACEHOLDER */}
                <p>Active Borrows: <strong>{member.active_borrows || 'N/A'}</strong></p>
            </div>
        </div>
    );
}

export default MemberCard;