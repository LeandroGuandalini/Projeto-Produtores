import React from 'react';
import { useApp } from '../../context/AppContext';
import styles from './Filter.module.css';

const Filter = () => {
  const { filters, setFilters, categories, clearFilters } = useApp();

  const handleFilterChange = (key, value) => {
    console.log(`Alterando filtro ${key}:`, value);
    setFilters({
      [key]: value
    });
  };

  const handleClearFilters = () => {
    console.log('Limpando filtros');
    clearFilters();
  };

  const hasActiveFilters = filters.category || filters.maxPrice || filters.location;

  console.log('Filtros atuais:', filters);
  console.log('Categorias disponíveis:', categories);

  return (
    <div className={styles.filter}>
      <div className={styles.filterHeader}>
        <h3>Filtros</h3>
        {hasActiveFilters && (
          <button onClick={handleClearFilters} className={styles.clearButton}>
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

      <div className={styles.filterInfo}>
        <small>Altere os filtros e veja os resultados em tempo real</small>
      </div>
    </div>
  );
};

export default Filter;