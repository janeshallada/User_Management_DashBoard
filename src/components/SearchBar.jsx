import React from 'react';
import '../styles/SearchBar.css';

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="searchbar">
      <span className="searchbar__icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>
      <input
        className="searchbar__input"
        type="text"
        placeholder="Search by name or email…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search users"
      />
      {value && (
        <button
          className="searchbar__clear"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
