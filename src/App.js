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
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = getAccessToken();
    const storedToken = localStorage.getItem("spotify_access_token");
  
    if (token) {
      localStorage.setItem("spotify_access_token", token);
      setAccessToken(token);
      console.log("Spotify Access Token Set:", token);
  
      // Fetch User ID
      fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => response.json())
        .then(data => {
          setUserId(data.id);
          console.log("Spotify User ID:", data.id);
        })
        .catch(error => console.error("Error fetching user ID:", error));
    } else if (storedToken) {
      fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then(response => {
          if (response.ok) {
            setAccessToken(storedToken);
            console.log("Using stored token:", storedToken);
            return response.json();
          } else {
            console.warn("Stored token expired, logging in again...");
            localStorage.removeItem("spotify_access_token");
            setAccessToken(null);
          }
        })
        .then(data => {
          if (data) {
            setUserId(data.id);
            console.log("Spotify User ID:", data.id);
          }
        })
        .catch(error => console.error("Error validating token:", error));
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

  const handleLogout = () => {
    localStorage.removeItem("spotify_access_token"); // Remove token from storage
    setAccessToken(null); // Clear token from state
    window.location.reload(); // Refresh page to reset auth state
  };

  const handleSearch = async (query) => {
    let token = accessToken || localStorage.getItem("spotify_access_token");
  
    if (!token) {
      console.error("No access token available. Please log in.");
      return;
    }
  
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.status === 401) {
        console.warn("Token expired. Logging out...");
        localStorage.removeItem("spotify_access_token");
        setAccessToken(null);
        window.location.href = getSpotifyAuthUrl(); // Force login again
        return;
      }
  
      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Search Results:", data);
  
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

  const savePlaylist = async (name, tracks) => {
    if (!accessToken) {
      console.error("No access token. Please log in.");
      return;
    }
    if (!userId) {
      console.error("No user ID. Cannot create playlist.");
      return;
    }
    if (!name || tracks.length === 0) {
      console.error("Playlist name and tracks are required.");
      return;
    }
  
    try {
      // Step 1: Create a new playlist
      const createPlaylistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          description: "Playlist created from Jammmer App",
          public: false, // Set to true if you want it to be public
        }),
      });
  
      if (!createPlaylistResponse.ok) {
        throw new Error("Failed to create playlist");
      }
  
      const playlistData = await createPlaylistResponse.json();
      console.log("Created Playlist:", playlistData);
  
      // Step 2: Add tracks to the new playlist
      const trackUris = tracks.map(track => track.uri);
      const addTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: trackUris }),
      });
  
      if (!addTracksResponse.ok) {
        throw new Error("Failed to add tracks to playlist");
      }
  
      console.log("Tracks added successfully to playlist!");
  
      alert(`Playlist "${name}" saved to Spotify!`);
    } catch (error) {
      console.error("Error saving playlist:", error);
      alert("Error saving playlist. Check console for details.");
    }
  };
  

  return (
    <div className="App">
      <header className="App-header">
        <img src={jammmerLogo} className="App-logo" alt="logo" />
        {!accessToken ? (
          <button onClick={handleLogin} className="login-button">Login to Spotify</button>
        ) : (
          <div>
            <p>✅ Logged in to Spotify</p>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
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
