import React from 'react';
import './App.css';
import jammmerLogo from './resources/images/jammmerLogo2.jpg';
import SearchBar from './components/SearchBar';


function App() {
  const handleSearch = (query) => {
    console.log("Search term:", query);
    // Later, Spotify API search function added here
  };
  
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={jammmerLogo} className="App-logo" alt="logo" />
        <SearchBar onSearch={handleSearch} />
      </header>
    </div>
  );
}

export default App;
