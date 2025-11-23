import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/formatters';
import styles from './ProductDetail.module.css';

const ProductDetail = ({ product, onBack }) => {
  const { getProducerById } = useApp();
  const producer = product ? getProducerById(product.producerId) : null;

  if (!product || !producer) {
    return (
      <div className={styles.productDetail}>
        <div className="container">
          <button onClick={onBack} className={styles.backButton}>
            ← Voltar
          </button>
          <div className={styles.error}>Produto não encontrado</div>
        </div>
      </div>
    );
  }

  const handleWhatsAppClick = () => {
    const message = `Olá! Gostaria de saber mais sobre o produto: ${product.name}`;
    const whatsappUrl = `https://wa.me/${producer.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className={styles.productDetail}>
      <div className="container">
        <button onClick={onBack} className={styles.backButton}>
          ← Voltar para a lista
        </button>

        <div className={styles.content}>
          <div className={styles.imageSection}>
            <img src={product.image} alt={product.name} className={styles.image} />
            {product.featured && <span className={styles.featuredBadge}>⭐ Destaque</span>}
          </div>

          <div className={styles.infoSection}>
            <div className={styles.header}>
              <h1 className={styles.name}>{product.name}</h1>
              <p className={styles.price}>{formatPrice(product.price)}<span>/{product.unit}</span></p>
            </div>

            <div className={styles.category}>
              <span className={styles.categoryBadge}>{product.category}</span>
            </div>

            <p className={styles.description}>{product.description}</p>

            <div className={styles.producerInfo}>
              <h3>Informações do Produtor</h3>
              <div className={styles.producerCard}>
                <img src={producer.image} alt={producer.name} className={styles.producerImage} />
                <div className={styles.producerDetails}>
                  <h4>{producer.name}</h4>
                  <p>{producer.location}</p>
                  <p className={styles.producerDescription}>{producer.description}</p>
                </div>
              </div>
            </div>

            <button className={styles.whatsappButton} onClick={handleWhatsAppClick}>
              <span className={styles.whatsappIcon}>💬</span>
              Contatar {producer.name} via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;