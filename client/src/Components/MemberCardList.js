// client/src/components/MemberCardList.js

import React from 'react';
import MemberCard from './MemberCard';

function MemberCardList({ members, onEdit, onDelete }) {
    if (members.length === 0) {
        return <p>No members found.</p>;
    }
    
    return (
        <div className="member-list-grid">
            {members.map(member => (
                <MemberCard 
                    key={member.id} 
                    member={member} 
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

export default MemberCardList;