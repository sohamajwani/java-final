// client/src/components/UserSelect.js

import React from 'react';

function UserSelect({ users, selectedUserId, setSelectedUserId }) {
  return (
    <section className="user-select-section">
        <h2>Select User for Actions</h2>
        <select 
          id="userId"
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