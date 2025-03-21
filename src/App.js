import React, { useState } from 'react';
import './App.css';
import jammmerLogo from './resources/images/jammmerLogo2.jpg';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';


function App() {
  const handleSearch = (query) => {
    console.log("Search term:", query);
    // Later, Spotify API search function added here
  };
  
  const [searchResults, setSearchResults] = React.useState([]);
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={jammmerLogo} className="App-logo" alt="logo" />
        <SearchBar onSearch={handleSearch} />
      </header>
      <div className="Results-container">
        <SearchResults results={searchResults} />
      </div>
      
    </div>
  );
}

export default App;
