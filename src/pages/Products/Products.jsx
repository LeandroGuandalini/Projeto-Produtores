import React from 'react';
import { useApp } from '../../context/AppContext';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/ProductCard/ProductCard';
import Filter from '../../components/Filter/Filter';
import styles from './Products.module.css';

const Products = ({ onProductSelect }) => {
  const { products, categories, totalProducts, filteredCount } = useProducts();
  const { setFilters, filters } = useApp();

  const handleCategoryClick = (category) => {
    setFilters({ category });
  };

  const handleAllCategories = () => {
    setFilters({ category: '' });
  };

  return (
    <div className={styles.products}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Todos os Produtos</h1>
          <p className={styles.subtitle}>
            {filteredCount} de {totalProducts} produtos encontrados
          </p>
        </div>

        <div className={styles.content}>
          <aside className={styles.sidebar}>
            <Filter />
            <div className={styles.categoriesList}>
              <h3>Categorias ({categories.length})</h3>
              <ul>
                <li>
                  <button 
                    className={`${styles.categoryButton} ${!filters.category ? styles.active : ''}`}
                    onClick={handleAllCategories}
                  >
                    Todas as categorias <span>({totalProducts})</span>
                  </button>
                </li>
                {categories.map(category => {
                  const categoryCount = products.filter(p => p.category === category).length;
                  return (
                    <li key={category}>
                      <button 
                        className={`${styles.categoryButton} ${filters.category === category ? styles.active : ''}`}
                        onClick={() => handleCategoryClick(category)}
                      >
                        {category} <span>({categoryCount})</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          <main className={styles.main}>
            <div className={styles.productsGrid}>
              {products.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onSelect={onProductSelect}
                />
              ))}
            </div>

            {products.length === 0 && (
              <div className={styles.emptyState}>
                <h3>Nenhum produto encontrado</h3>
                <p>Tente ajustar os filtros ou buscar por outros termos.</p>
                <button 
                  onClick={() => window.location.reload()}
                  className={styles.refreshButton}
                >
                  Recarregar página
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;