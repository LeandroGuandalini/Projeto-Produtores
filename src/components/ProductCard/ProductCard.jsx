import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/formatters';
import styles from './ProductCard.module.css';

const ProductCard = ({ product, onSelect }) => {
  const { getProducerById } = useApp();
  const producer = getProducerById(product.producerId);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleWhatsAppClick = (e) => {
    e.stopPropagation();
    if (!producer) return;
    
    const message = `Olá! Gostaria de saber mais sobre o produto: ${product.name}`;
    const whatsappUrl = `https://wa.me/${producer.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(product);
    }
  };

  // Imagem padrão caso a URL falhe
  const defaultImage = "https://picsum.photos/id/292/400/300";

  return (
    <div className={styles.productCard} onClick={handleCardClick}>
      <div className={styles.imageContainer}>
        <img 
          src={imageError ? defaultImage : product.image} 
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
        
        <button className={styles.whatsappButton} onClick={handleWhatsAppClick}>
          <span className={styles.whatsappIcon}>💬</span>
          Contatar via WhatsApp
        </button>
      </div>
    </div>
  );
};

export default ProductCard;