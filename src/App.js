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
    const storedToken = localStorage.getItem("spotify_access_token");
  
    if (token) {
      localStorage.setItem("spotify_access_token", token);
      setAccessToken(token);
      console.log("Spotify Access Token Set:", token);
    } else if (storedToken) {
      // Validate stored token before using it
      fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then((response) => {
          if (response.ok) {
            setAccessToken(storedToken);
            console.log("Using stored token:", storedToken);
          } else {
            console.warn("Stored token expired, logging in again...");
            localStorage.removeItem("spotify_access_token");
            setAccessToken(null);
          }
        })
        .catch((error) => console.error("Error validating token:", error));
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      setTimeout(() => {
        console.log("Spotify token expired. Logging in again...");
        localStorage.removeItem("spotify_access_token");
        setAccessToken(null);
        window.location.href = getSpotifyAuthUrl(); // Redirect for re-login
      }, 3600 * 1000); // 1 hour
    }
  }, [accessToken]);
  

  const handleLogin = () => {
    window.location.href = getSpotifyAuthUrl();
  };

  const handleSearch = async (query) => {
    if (!accessToken) {
      console.error("No access token available");
      return;
    }
  
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
  
      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Search Results:", data);
  
      // Extract track data from API response
      const tracks = data.tracks.items.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0]?.name,
        album: track.album.name,
        uri: track.uri,
      }));
  
      setSearchResults(tracks);
    } catch (error) {
      console.error("Error fetching Spotify search results:", error);
    }
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
