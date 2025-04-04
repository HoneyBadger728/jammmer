import React from 'react';

const SearchResults = ({ results, onAdd }) => {
  return (
    <div className="SearchResults">
      <h2>Search Results</h2>
      {results.length > 0 ? (
        results.map((track) => (
          <div key={track.id} className="Track">
            <div className="Track-container">
                <div className="Track-info">
                    <h3>{track.name}</h3>
                    <p>{track.artist} | {track.album}</p>
                </div>
                <div className='Track-buttons'>
                  <a 
                    href={`https://open.spotify.com/track/${track.id}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="spotify-button"
                  >
                    Play on Spotify
                  </a>
                  <button className="add-button" onClick={() => onAdd(track)}>+</button>
                </div>
            </div>
          </div>
        ))
      ) : (
        <p className="no-results">No results yet. Try searching for a song!</p>
      )}
    </div>
  );
};

export default SearchResults;
