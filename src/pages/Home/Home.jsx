import React from 'react';
import { useApp } from '../../context/AppContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import Filter from '../../components/Filter/Filter';
import styles from './Home.module.css';

const Home = ({ onProductSelect }) => {
  const { featuredProducts, producers, products, searchTerm, filteredProducts } = useApp();

  const stats = [
    { value: producers.length, label: 'Produtores Cadastrados' },
    { value: products.length, label: 'Produtos Disponíveis' },
    { value: '100%', label: 'Direto do Produtor' },
    { value: featuredProducts.length, label: 'Produtos em Destaque' }
  ];

  const displayProducts = searchTerm ? filteredProducts : featuredProducts;

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Conectando produtores rurais e consumidores
            </h1>
            <p className={styles.heroSubtitle}>
              Encontre produtos frescos diretamente do produtor e entre em contato via WhatsApp
            </p>
            <div className={styles.heroStats}>
              {stats.map((stat, index) => (
                <div key={index} className={styles.stat}>
                  <span className={styles.statValue}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      {searchTerm && (
        <section className={styles.filtersSection}>
          <div className="container">
            <Filter />
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <h2 className="sectionTitle">
            {searchTerm ? 'Produtos Encontrados' : 'Produtos em Destaque'}
          </h2>
          
          <div className={styles.productsGrid}>
            {displayProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onSelect={onProductSelect}
              />
            ))}
          </div>

          {displayProducts.length === 0 && (
            <div className={styles.emptyState}>
              <p>Nenhum produto encontrado. Tente ajustar os filtros.</p>
            </div>
          )}
        </div>
      </section>

      {/* How it Works */}
      <section className={styles.howItWorks}>
        <div className="container">
          <h2 className="sectionTitle">Como Funciona</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepIcon}>1</div>
              <h3>Encontre Produtos</h3>
              <p>Busque por produtos frescos diretamente dos produtores locais</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepIcon}>2</div>
              <h3>Contate o Produtor</h3>
              <p>Entre em contato diretamente via WhatsApp para negociar</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepIcon}>3</div>
              <h3>Receba em Casa</h3>
              <p>Combine a entrega e receba produtos frescos na sua porta</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;