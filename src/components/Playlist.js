import React, { useState } from "react";

const Playlist = ({ playlistTracks, onRemove, onSave }) => {
  const [playlistName, setPlaylistName] = useState("New Playlist");

  const handleNameChange = (event) => {
    setPlaylistName(event.target.value);
  };

  return (
    <div className="playlist">
        
        <div className="New-playlist">
            <h2>Playlist</h2>
            <input 
                type="text" 
                value={playlistName} 
                onChange={handleNameChange} 
                className="playlist-name"
            />
            <button onClick={() => onSave(playlistName, playlistTracks)}>
            Save to Spotify
            </button>
        </div>
        <div className="track-list">
        {playlistTracks.map((track) => (
          <div key={track.id} className="track">
            <p>{track.name} - {track.artist}</p>
            <button onClick={() => onRemove(track)}>x</button>
          </div>
        ))}
        </div>
      
    </div>
  );
};

export default Playlist;
