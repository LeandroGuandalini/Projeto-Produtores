import React from 'react';
import { useApp } from '../../context/AppContext';
import styles from './SearchBar.module.css';

const SearchBar = () => {
  const { searchTerm, setSearchTerm } = useApp();

  return (
    <div className={styles.searchBar}>
      <div className={styles.searchIcon}>🔍</div>
      <input
        type="text"
        placeholder="Buscar produtos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />
      {searchTerm && (
        <button 
          className={styles.clearButton}
          onClick={() => setSearchTerm('')}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default SearchBar;