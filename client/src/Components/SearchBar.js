// client/src/components/SearchBar.js

import React, { useState } from 'react';

function SearchBar({ onSearch, refreshBooks }) {
  const [query, setQuery] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);

  const handleSearchClick = () => {
    onSearch(query, availableOnly);
  };
  
  const handleRefresh = () => {
      setQuery('');
      setAvailableOnly(false);
      refreshBooks();
  };

  return (
    <section className="search-section">
      <h2>Search Books</h2>
      <div>
        <input 
          type="text" 
          placeholder="Search by title or author"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <label>
          <input 
            type="checkbox" 
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)}
          /> Only show available
        </label>
        <button onClick={handleSearchClick}>Search</button>
        <button onClick={handleRefresh}>Clear Filters / Refresh</button>
      </div>
    </section>
  );
}

export default SearchBar;