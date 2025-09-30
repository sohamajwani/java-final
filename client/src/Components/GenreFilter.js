// client/src/components/GenreFilter.js

import React from 'react';

function GenreFilter({ genres, currentGenre, onFilter, onAll }) {
  return (
    <section className="genre-section">
      <h2>Browse by Genre</h2>
      <div className="genre-filter-container">
        <button 
          className={`genre-btn ${currentGenre === null ? 'active' : ''}`} 
          onClick={onAll}
        >
          All Books
        </button>
        {genres.map(genre => (
          <button 
            key={genre}
            className={`genre-btn ${currentGenre === genre ? 'active' : ''}`}
            onClick={() => onFilter(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
    </section>
  );
}

export default GenreFilter;