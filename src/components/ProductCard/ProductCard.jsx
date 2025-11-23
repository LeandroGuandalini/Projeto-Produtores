import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/formatters';
import styles from './ProductCard.module.css';

const ProductCard = ({ product, onSelect }) => {
  const { getProducerById, addToFavorites, removeFromFavorites, favorites, handleWhatsAppClick, defaultImages } = useApp();
  const producer = getProducerById(product.producerId);
  const [imageError, setImageError] = useState(false);

  const isFavorite = favorites.some(fav => fav.id === product.id);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(product);
    }
  };

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    if (producer) {
      handleWhatsAppClick(product, producer);
    }
  };

  return (
    <div className={styles.productCard} onClick={handleCardClick}>
      <div className={styles.imageContainer}>
        <button 
          className={`${styles.favoriteButton} ${isFavorite ? styles.favorited : ''}`}
          onClick={handleFavoriteClick}
          title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
        <img 
          src={imageError ? defaultImages.product : (product.image || defaultImages.product)} 
          alt={product.name} 
          className={styles.image}
          onError={handleImageError}
        />
        {product.featured && <span className={styles.featuredBadge}>⭐ Destaque</span>}
        <span className={styles.categoryBadge}>{product.category}</span>
      </div>
      
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.name}>{product.name}</h3>
          <p className={styles.price}>{formatPrice(product.price)}<span>/{product.unit}</span></p>
        </div>
        
        <p className={styles.description}>{product.description}</p>
        
        <div className={styles.producerInfo}>
          <div className={styles.producerDetails}>
            <span className={styles.producerName}>{producer?.name}</span>
            <span className={styles.producerLocation}>{producer?.location}</span>
          </div>
        </div>
        
        <button 
          className={styles.whatsappButton} 
          onClick={handleWhatsApp}
        >
          <span className={styles.whatsappIcon}>💬</span>
          Contatar via WhatsApp
        </button>
      </div>
    </div>
  );
};

export default ProductCard;