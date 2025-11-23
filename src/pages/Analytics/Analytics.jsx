import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/formatters';
import styles from './Analytics.module.css';

const Analytics = () => {
  const { currentUser, products } = useApp();

  if (!currentUser || currentUser.type !== 'producer') {
    return (
      <div className={styles.analytics}>
        <div className="container">
          <div className={styles.notAllowed}>
            <h2>📊 Acesso Restrito</h2>
            <p>Esta área é exclusiva para produtores cadastrados.</p>
          </div>
        </div>
      </div>
    );
  }

  // Estatísticas do produtor
  const producerProducts = products.filter(p => p.producerId === currentUser.id);
  const availableProducts = producerProducts.filter(p => p.available);
  const featuredProducts = producerProducts.filter(p => p.featured);
  
  // Métricas
  const totalProducts = producerProducts.length;
  const totalRevenue = producerProducts.reduce((sum, product) => sum + (product.price * (product.quantity || 0)), 0);
  const totalUnits = producerProducts.reduce((sum, product) => sum + (product.quantity || 0), 0);

  // Produtos por categoria
  const productsByCategory = producerProducts.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className={styles.analytics}>
      <div className="container">
        <div className={styles.header}>
          <h1>📊 Analytics & Relatórios</h1>
          <p>Painel de performance dos seus produtos</p>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📦</div>
            <div className={styles.statInfo}>
              <h3>Total de Produtos</h3>
              <span className={styles.statNumber}>{totalProducts}</span>
              <span className={styles.statSubtitle}>
                {availableProducts.length} disponíveis
              </span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>💰</div>
            <div className={styles.statInfo}>
              <h3>Valor em Estoque</h3>
              <span className={styles.statNumber}>{formatPrice(totalRevenue)}</span>
              <span className={styles.statSubtitle}>
                Potencial de vendas
              </span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>⭐</div>
            <div className={styles.statInfo}>
              <h3>Produtos em Destaque</h3>
              <span className={styles.statNumber}>{featuredProducts.length}</span>
              <span className={styles.statSubtitle}>
                {((featuredProducts.length / totalProducts) * 100).toFixed(0)}% do catálogo
              </span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>📊</div>
            <div className={styles.statInfo}>
              <h3>Unidades em Estoque</h3>
              <span className={styles.statNumber}>{totalUnits}</span>
              <span className={styles.statSubtitle}>
                Total de unidades
              </span>
            </div>
          </div>
        </div>

        <div className={styles.chartsSection}>
          <div className={styles.popularProducts}>
            <h3>📈 Distribuição por Categoria</h3>
            <div className={styles.productsList}>
              {Object.entries(productsByCategory).map(([category, count], index) => (
                <div key={category} className={styles.productRank}>
                  <div className={styles.rankNumber}>{index + 1}</div>
                  <div className={styles.productInfo}>
                    <h4>{category}</h4>
                    <p>{count} produto{count !== 1 ? 's' : ''}</p>
                  </div>
                  <div className={styles.conversationCount}>
                    <span className={styles.count}>
                      {((count / totalProducts) * 100).toFixed(0)}%
                    </span>
                    <small>do total</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.conversationStats}>
            <h3>📋 Resumo do Inventário</h3>
            <div className={styles.conversationChart}>
              {producerProducts.slice(0, 5).map(product => (
                <div key={product.id} className={styles.chartBar}>
                  <div className={styles.barLabel}>{product.name}</div>
                  <div className={styles.barContainer}>
                    <div 
                      className={styles.barFill}
                      style={{ 
                        width: `${Math.min((product.quantity || 0) / 100 * 100, 100)}%` 
                      }}
                    >
                      <span className={styles.barValue}>{product.quantity || 0} {product.unit}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.insights}>
          <h3>💡 Insights e Recomendações</h3>
          <div className={styles.insightsGrid}>
            {featuredProducts.length === 0 && totalProducts > 0 && (
              <div className={styles.insightCard}>
                <div className={styles.insightIcon}>⭐</div>
                <div className={styles.insightContent}>
                  <h4>Destaque seus melhores produtos</h4>
                  <p>Produtos em destaque recebem mais visibilidade na página inicial.</p>
                </div>
              </div>
            )}

            {totalProducts === 0 && (
              <div className={styles.insightCard}>
                <div className={styles.insightIcon}>🚀</div>
                <div className={styles.insightContent}>
                  <h4>Comece cadastrando seus produtos</h4>
                  <p>Adicione seus primeiros produtos para aparecer para os clientes.</p>
                </div>
              </div>
            )}

            {totalRevenue > 0 && (
              <div className={styles.insightCard}>
                <div className={styles.insightIcon}>💰</div>
                <div className={styles.insightContent}>
                  <h4>Potencial de vendas</h4>
                  <p>Seu estoque tem um valor total de {formatPrice(totalRevenue)}.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;