import React, { useState, useEffect } from 'react';
import './App.css';
import jammmerLogo from './resources/images/jammmerLogo2.jpg';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import Playlist from './components/Playlist';
import { getSpotifyAuthUrl, getAccessToken } from './components/SpotifyAuth';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("spotify_access_token") || null);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      setAccessToken(token);
      localStorage.setItem("spotify_access_token", token); // Store token for persistence
      console.log("Spotify Access Token:", token);
    }
  }, []);

  const handleLogin = () => {
    window.location.href = getSpotifyAuthUrl();
  };

  const handleSearch = (query) => {
    console.log("Search term:", query);
    // Later, Spotify API search function added here
  };

  const addTrack = (track) => {
    if (!playlistTracks.some((t) => t.id === track.id)) {
      setPlaylistTracks([...playlistTracks, track]);
    }
  };

  const removeTrack = (track) => {
    setPlaylistTracks(playlistTracks.filter((t) => t.id !== track.id));
  };

  const savePlaylist = (name, tracks) => {
    console.log("Saving playlist:", name, tracks);
    // Later, Spotify API save playlist function added here
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={jammmerLogo} className="App-logo" alt="logo" />
        {!accessToken ? (
          <button onClick={handleLogin}>Login to Spotify</button>
        ) : (
          <p>✅ Logged in to Spotify</p>
        )}
        <SearchBar onSearch={handleSearch} />
      </header>
      <div className="Body-container">
        <div className="Results-container">
          <SearchResults results={searchResults} onAdd={addTrack} />
        </div>
        <div className="Playlist-container">
          <Playlist
            playlistTracks={playlistTracks}
            onRemove={removeTrack}
            onSave={savePlaylist}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
