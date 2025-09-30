// client/src/components/SearchBar.js (Updated for Aesthetic)

import React, { useState } from 'react';

function SearchBar({ onSearch, refreshBooks, placeholder }) {
    const [query, setQuery] = useState('');
    const [availableOnly, setAvailableOnly] = useState(false); 

    const handleSearchClick = () => {
        onSearch(query, availableOnly);
    };
    
    const handleClearRefreshClick = () => {
        setQuery('');
        setAvailableOnly(false);
        refreshBooks();
    };

    const isBookSearch = placeholder && placeholder.includes("title or author");

    return (
        <div className="search-bar-container">
            
            {/* Input Wrapper - Takes maximum space */}
            <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    className="search-input"
                    placeholder={placeholder || "Search by title, author, or ISBN..."}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') handleSearchClick();
                    }}
                />
            </div>
            
            {/* Action Buttons - Moved to the right */}
            <div className="search-actions">
                {isBookSearch && (
                    <label className="checkbox-container">
                        <input
                            type="checkbox"
                            checked={availableOnly}
                            onChange={(e) => setAvailableOnly(e.target.checked)}
                        />
                        Only show available
                    </label>
                )}
                
                {/* Search Button */}
                <button className="search-btn action-btn" onClick={handleSearchClick}>Search</button>
                
                {/* Clear/Refresh Button */}
                <button className="clear-refresh-btn action-btn" onClick={handleClearRefreshClick}>Clear / Refresh</button>
            </div>
            
        </div>
    );
}

export default SearchBar;