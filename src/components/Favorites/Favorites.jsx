import React from 'react';
import { useApp } from '../../context/AppContext';
import ProductCard from '../ProductCard/ProductCard';
import styles from './Favorites.module.css';

const Favorites = ({ isOpen, onClose }) => {
  const { favorites, removeFromFavorites } = useApp();

  if (!isOpen) return null;

  return (
    <div className={styles.favoritesOverlay} onClick={onClose}>
      <div className={styles.favoritesContent} onClick={e => e.stopPropagation()}>
        <div className={styles.favoritesHeader}>
          <h2>⭐ Meus Favoritos</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.favoritesBody}>
          {favorites.length === 0 ? (
            <div className={styles.emptyFavorites}>
              <div className={styles.emptyIcon}>⭐</div>
              <h3>Nenhum favorito</h3>
              <p>Adicione produtos aos favoritos para encontrá-los facilmente depois</p>
            </div>
          ) : (
            <div className={styles.favoritesGrid}>
              {favorites.map(product => (
                <div key={product.id} className={styles.favoriteItem}>
                  <ProductCard product={product} />
                  <button 
                    className={styles.removeButton}
                    onClick={() => removeFromFavorites(product.id)}
                    title="Remover dos favoritos"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;