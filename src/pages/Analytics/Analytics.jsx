import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/formatters';
import styles from './Analytics.module.css';

const Analytics = () => {
  const { currentUser, products, conversationHistory } = useApp();

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
  
  // Conversas relacionadas aos produtos do produtor
  const producerConversations = conversationHistory.filter(conv => 
    producerProducts.some(p => p.name === conv.productName)
  );

  // Métricas
  const totalProducts = producerProducts.length;
  const totalConversations = producerConversations.length;
  const conversionRate = totalProducts > 0 ? (totalConversations / totalProducts * 100).toFixed(1) : 0;
  const totalRevenue = producerProducts.reduce((sum, product) => sum + (product.price * (product.quantity || 0)), 0);

  // Produtos mais populares (por conversas)
  const productPopularity = producerProducts.map(product => {
    const conversations = producerConversations.filter(conv => conv.productName === product.name);
    return {
      ...product,
      conversationCount: conversations.length
    };
  }).sort((a, b) => b.conversationCount - a.conversationCount);

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
            <div className={styles.statIcon}>💬</div>
            <div className={styles.statInfo}>
              <h3>Conversas Iniciadas</h3>
              <span className={styles.statNumber}>{totalConversations}</span>
              <span className={styles.statSubtitle}>
                Taxa de conversão: {conversionRate}%
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
        </div>

        <div className={styles.chartsSection}>
          <div className={styles.popularProducts}>
            <h3>🏆 Produtos Mais Populares</h3>
            <div className={styles.productsList}>
              {productPopularity.slice(0, 5).map((product, index) => (
                <div key={product.id} className={styles.productRank}>
                  <div className={styles.rankNumber}>{index + 1}</div>
                  <div className={styles.productInfo}>
                    <h4>{product.name}</h4>
                    <p>{formatPrice(product.price)}/{product.unit}</p>
                  </div>
                  <div className={styles.conversationCount}>
                    <span className={styles.count}>{product.conversationCount}</span>
                    <small>conversas</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.conversationStats}>
            <h3>📈 Estatísticas de Conversas</h3>
            <div className={styles.conversationChart}>
              {productPopularity.slice(0, 5).map(product => (
                <div key={product.id} className={styles.chartBar}>
                  <div className={styles.barLabel}>{product.name}</div>
                  <div className={styles.barContainer}>
                    <div 
                      className={styles.barFill}
                      style={{ 
                        width: `${(product.conversationCount / Math.max(...productPopularity.map(p => p.conversationCount)) * 100)}%` 
                      }}
                    >
                      <span className={styles.barValue}>{product.conversationCount}</span>
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
            {totalConversations === 0 && (
              <div className={styles.insightCard}>
                <div className={styles.insightIcon}>🚀</div>
                <div className={styles.insightContent}>
                  <h4>Promova seus produtos</h4>
                  <p>Nenhuma conversa iniciada ainda. Considere destacar seus produtos ou ajustar os preços.</p>
                </div>
              </div>
            )}

            {featuredProducts.length === 0 && (
              <div className={styles.insightCard}>
                <div className={styles.insightIcon}>⭐</div>
                <div className={styles.insightContent}>
                  <h4>Destaque seus melhores produtos</h4>
                  <p>Produtos em destaque recebem mais visibilidade na página inicial.</p>
                </div>
              </div>
            )}

            {conversionRate < 10 && totalConversations > 0 && (
              <div className={styles.insightCard}>
                <div className={styles.insightIcon}>📝</div>
                <div className={styles.insightContent}>
                  <h4>Melhore suas descrições</h4>
                  <p>Sua taxa de conversão está baixa. Considere melhorar as descrições e fotos dos produtos.</p>
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