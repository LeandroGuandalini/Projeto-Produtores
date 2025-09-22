// components/Filter/Filter.js
import React from 'react';
import { useApp } from '../../src/context/AppContext';
import styles from './Filter.module.css';

const Filter = () => {
  const { filters, setFilters, categories } = useApp();

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      maxPrice: '',
      location: ''
    });
  };

  const hasActiveFilters = filters.category || filters.maxPrice || filters.location;

  return (
    <div className={styles.filter}>
      <div className={styles.filterHeader}>
        <h3>Filtros</h3>
        {hasActiveFilters && (
          <button onClick={clearFilters} className={styles.clearButton}>
            Limpar
          </button>
        )}
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="category">Categoria</label>
        <select 
          id="category"
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className={styles.select}
        >
          <option value="">Todas as categorias</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="maxPrice">Preço máximo (R$)</label>
        <input 
          type="number"
          id="maxPrice"
          value={filters.maxPrice}
          onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
          placeholder="Ex: 50.00"
          min="0"
          step="0.01"
          className={styles.input}
        />
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="location">Localização</label>
        <input 
          type="text"
          id="location"
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          placeholder="Ex: São Paulo"
          className={styles.input}
        />
      </div>
    </div>
  );
};

export default Filter;