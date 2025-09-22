// pages/Products/Products.js
import React from 'react';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/ProductCard/ProductCard';
import Filter from '../../components/Filter/Filter';
import styles from './Products.module.css';

const Products = ({ onProductSelect }) => {
  const { products, categories, totalProducts, filteredCount } = useProducts();

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
              <h3>Categorias</h3>
              <ul>
                {categories.map(category => (
                  <li key={category}>
                    <button className={styles.categoryButton}>
                      {category} <span>({products.filter(p => p.category === category).length})</span>
                    </button>
                  </li>
                ))}
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
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;