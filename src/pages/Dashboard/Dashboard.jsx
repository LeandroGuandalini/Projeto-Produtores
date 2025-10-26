import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/formatters';
import styles from './Dashboard.module.css';

const Dashboard = ({ onEditProduct, onAddProduct }) => {
  const { currentUser, myProducts, deleteProduct } = useApp();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  if (!currentUser) {
    return (
      <div className={styles.dashboard}>
        <div className="container">
          <div className={styles.notLoggedIn}>
            <h2>🔒 Acesso Restrito</h2>
            <p>Você precisa estar logado como produtor para acessar o dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  // Cálculos para estatísticas
  const totalProducts = myProducts.length;
  const featuredProducts = myProducts.filter(p => p.featured).length;
  const availableProducts = myProducts.filter(p => p.available).length;
  
  // Cálculo do valor total em estoque considerando quantidade
  const totalValue = myProducts.reduce((sum, product) => 
    sum + (product.price * (product.quantity || 0)), 0
  );
  
  // Total de unidades em estoque
  const totalUnits = myProducts.reduce((sum, product) => 
    sum + (product.quantity || 0), 0
  );
  
  // Produtos com estoque baixo (menos de 10 unidades)
  const lowStockProducts = myProducts.filter(p => (p.quantity || 0) < 10).length;
  
  // Produtos sem estoque
  const outOfStockProducts = myProducts.filter(p => (p.quantity || 0) === 0).length;

  const handleEdit = (productId) => {
    if (onEditProduct) {
      onEditProduct(productId);
    }
  };

  const handleDelete = (productId) => {
    setShowDeleteConfirm(productId);
  };

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      deleteProduct(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  const handleAddProduct = () => {
    if (onAddProduct) {
      onAddProduct();
    }
  };

  // Função para determinar a cor do estoque
  const getStockStatus = (quantity) => {
    if (quantity === 0) return 'out-of-stock';
    if (quantity < 10) return 'low-stock';
    if (quantity < 30) return 'medium-stock';
    return 'high-stock';
  };

  // Função para determinar o texto do estoque
  const getStockText = (quantity) => {
    if (quantity === 0) return 'Sem estoque';
    if (quantity < 10) return 'Estoque baixo';
    if (quantity < 30) return 'Estoque médio';
    return 'Estoque bom';
  };

  return (
    <div className={styles.dashboard}>
      <div className="container">
        <div className={styles.header}>
          <h1>Dashboard do Produtor</h1>
          <p>Bem-vindo de volta, {currentUser.name}! 👋</p>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📦</div>
            <div className={styles.statInfo}>
              <h3>Total de Produtos</h3>
              <span className={styles.statNumber}>{totalProducts}</span>
              <span className={styles.statSubtitle}>{totalUnits} unidades</span>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>⭐</div>
            <div className={styles.statInfo}>
              <h3>Em Destaque</h3>
              <span className={styles.statNumber}>{featuredProducts}</span>
              <span className={styles.statSubtitle}>Produtos</span>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>💰</div>
            <div className={styles.statInfo}>
              <h3>Valor em Estoque</h3>
              <span className={styles.statNumber}>{formatPrice(totalValue)}</span>
              <span className={styles.statSubtitle}>Valor total</span>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>⚠️</div>
            <div className={styles.statInfo}>
              <h3>Estoque Baixo</h3>
              <span className={`${styles.statNumber} ${lowStockProducts > 0 ? styles.warning : ''}`}>
                {lowStockProducts}
              </span>
              <span className={styles.statSubtitle}>Produtos</span>
            </div>
          </div>
        </div>

        <div className={styles.productsSection}>
          <div className={styles.sectionHeader}>
            <h2>Meus Produtos</h2>
            <button 
              className={styles.addProductBtn}
              onClick={handleAddProduct}
            >
              ➕ Cadastrar Novo Produto
            </button>
          </div>

          {myProducts.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📦</div>
              <h3>Nenhum produto cadastrado</h3>
              <p>Comece cadastrando seu primeiro produto para aparecer para os clientes.</p>
              <button 
                className={styles.addProductBtn}
                onClick={handleAddProduct}
              >
                Cadastrar Primeiro Produto
              </button>
            </div>
          ) : (
            <div className={styles.productsGrid}>
              {myProducts.map(product => (
                <div key={product.id} className={styles.productItem}>
                  <div className={styles.productImage}>
                    <img src={product.image} alt={product.name} />
                    {product.featured && <span className={styles.featuredBadge}>⭐ Destaque</span>}
                    <div className={`${styles.stockBadge} ${styles[getStockStatus(product.quantity || 0)]}`}>
                      {getStockText(product.quantity || 0)}
                    </div>
                  </div>
                  
                  <div className={styles.productInfo}>
                    <h4>{product.name}</h4>
                    <p className={styles.category}>{product.category}</p>
                    <p className={styles.price}>{formatPrice(product.price)}<span>/{product.unit}</span></p>
                    
                    <div className={styles.quantityInfo}>
                      <div className={styles.quantity}>
                        <strong>Quantidade:</strong> {product.quantity || 0} {product.unit}
                      </div>
                      <div className={styles.itemValue}>
                        <strong>Valor do lote:</strong> {formatPrice((product.quantity || 0) * product.price)}
                      </div>
                    </div>
                    
                    <p className={styles.description}>{product.description}</p>
                    
                    <div className={styles.productMeta}>
                      <span className={`${styles.status} ${product.available ? styles.available : styles.unavailable}`}>
                        {product.available ? '🟢 Disponível' : '🔴 Indisponível'}
                      </span>
                      <span className={styles.date}>
                        Cadastrado em: {new Date(product.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  <div className={styles.actions}>
                    <button 
                      className={styles.editBtn}
                      onClick={() => handleEdit(product.id)}
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(product.id)}
                    >
                      🗑️ Excluir
                    </button>
                  </div>

                  {showDeleteConfirm === product.id && (
                    <div className={styles.deleteConfirm}>
                      <p>Tem certeza que deseja excluir "{product.name}"?</p>
                      <div className={styles.confirmActions}>
                        <button className={styles.confirmDelete} onClick={confirmDelete}>
                          Sim, Excluir
                        </button>
                        <button className={styles.cancelDelete} onClick={cancelDelete}>
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.stockSummary}>
          <h3>Resumo do Estoque</h3>
          <div className={styles.stockGrid}>
            <div className={styles.stockItem}>
              <span className={styles.stockCount}>{totalUnits}</span>
              <span className={styles.stockLabel}>Unidades totais</span>
            </div>
            <div className={styles.stockItem}>
              <span className={styles.stockCount}>{formatPrice(totalValue)}</span>
              <span className={styles.stockLabel}>Valor total</span>
            </div>
            <div className={styles.stockItem}>
              <span className={`${styles.stockCount} ${lowStockProducts > 0 ? styles.warning : ''}`}>
                {lowStockProducts}
              </span>
              <span className={styles.stockLabel}>Estoque baixo</span>
            </div>
            <div className={styles.stockItem}>
              <span className={`${styles.stockCount} ${outOfStockProducts > 0 ? styles.danger : ''}`}>
                {outOfStockProducts}
              </span>
              <span className={styles.stockLabel}>Sem estoque</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;