// client/src/Components/UserSelect.js (Structure Fixed for Left-Alignment)

import React from 'react';

function UserSelect({ users, selectedUserId, setSelectedUserId }) {
    
    return (
        <section className="user-select-section">
            <h2 className="select-user-title">Select User for Actions</h2>
            
            {/* The dropdown is placed directly in the section */}
            <select 
                id="userId"
                className="user-dropdown" // New class for styling
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
            >
                <option value="">--- Select User ---</option>
                {users.map(user => (
                    <option key={user.id} value={user.id}>
                        {user.name}
                    </option>
                ))}
            </select>
        </section>
    );
}

export default UserSelect;