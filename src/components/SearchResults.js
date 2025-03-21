import React from 'react';

const SearchResults = ({ results }) => {
  return (
    <div className="SearchResults">
      <h2>Results</h2>
      {results.length > 0 ? (
        results.map((track, index) => (
          <div key={index} className="Track">
            <div className="Track-info">
              <h3>{track.name}</h3>
              <p>{track.artist} | {track.album}</p>
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
