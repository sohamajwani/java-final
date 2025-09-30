// client/src/components/MemberFilter.js

import React from 'react';

// Example types for filtering
const memberTypes = ["Student", "Faculty", "Public"];

function MemberFilter({ currentType, onFilter, onAll }) {
    return (
        <div className="genre-filter-container">
            <button 
                className={`genre-btn ${currentType === null ? 'active' : ''}`} 
                onClick={onAll}
            >
                All Members
            </button>
            {memberTypes.map(type => (
                <button 
                    key={type}
                    className={`genre-btn ${currentType === type ? 'active' : ''}`}
                    onClick={() => onFilter(type)}
                >
                    {type}
                </button>
            ))}
        </div>
    );
}

export default MemberFilter;