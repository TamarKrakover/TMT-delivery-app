import React from 'react';
import { IoIosSearch } from 'react-icons/io';
import './SearchBar.css';

const SearchBar = ({ onSearch, placeholder = "Search" }) => {
  const handleChange = (e) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="search-bar-wrapper">
      <IoIosSearch className="search-icon" />
      <input
        type="text"
        className="search-bar-input"
        placeholder={placeholder}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBar;
