import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from '../../components/common/Icons';
import { restaurantService } from '../../services/restaurantService';
import mockRestaurants from '../../data/restaurants.json';
import './SearchBar.css';

const SearchBar = ({ placeholder = "Search for restaurants or dishes..." }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search query fetching
  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const data = await restaurantService.search(query);
        setResults(data);
        setIsOpen(true);
      } catch (err) {
        console.error("Search preview failed:", err);
        // Fallback to local mock filtering on error to prevent breaking app
        const lower = query.toLowerCase();
        const fallback = mockRestaurants.filter(r => r.name.toLowerCase().includes(lower));
        setResults(fallback);
        setIsOpen(true);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const handleSearchSubmit = () => {
    if (query.trim() !== '') {
      setIsOpen(false);
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleItemClick = (item) => {
    setIsOpen(false);
    // If it has a location or address field, it is a restaurant. Otherwise it is a product.
    if (item.location !== undefined || item.address !== undefined) {
      navigate(`/restaurant/${item.id}`);
    } else {
      navigate(`/restaurant/${item.restaurantId}`);
    }
  };

  return (
    <div className="search-bar-wrapper" ref={wrapperRef}>
      <FiSearch className="search-icon" onClick={handleSearchSubmit} />
      <input
        type="text"
        className="search-bar-input"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => query.trim() !== '' && setIsOpen(true)}
      />
      {query && (
        <FiX className="clear-icon" onClick={handleClear} />
      )}

      {isOpen && results.length > 0 && (
        <div className="search-dropdown">
          {results.map((item) => (
            <div
              key={item.id}
              className="search-dropdown-item"
              onClick={() => handleItemClick(item)}
            >
              <span className="search-dropdown-name">{item.name}</span>
              <span className="search-dropdown-type">
                {(item.location !== undefined || item.address !== undefined) ? 'Restaurant' : 'Dish'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
