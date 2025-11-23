import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatPhone } from '../../utils/formatters';
import styles from './ProducerCard.module.css';

const ProducerCard = ({ producer }) => {
  const { products } = useApp();
  const producerProducts = products.filter(p => p.producerId === producer.id && p.available);

  const handleWhatsAppClick = () => {
    const message = `Olá! Gostaria de conhecer mais sobre seus produtos.`;
    const whatsappUrl = `https://wa.me/${producer.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className={styles.producerCard}>
      <div className={styles.header}>
        <div className={styles.imageContainer}>
          <img src={producer.image} alt={producer.name} className={styles.image} />
        </div>
        <div className={styles.info}>
          <h3 className={styles.name}>{producer.name}</h3>
          <p className={styles.location}>{producer.location}</p>
          <p className={styles.productsCount}>
            {producerProducts.length} produto{producerProducts.length !== 1 ? 's' : ''} disponível{producerProducts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <p className={styles.description}>{producer.description}</p>

      <div className={styles.categories}>
        {producer.categories?.map(category => (
          <span key={category} className={styles.categoryTag}>
            {category}
          </span>
        ))}
      </div>

      <div className={styles.actions}>
        <button className={styles.whatsappButton} onClick={handleWhatsAppClick}>
          <span className={styles.whatsappIcon}>💬</span>
          Contatar
        </button>
        <div className={styles.contactInfo}>
          <span className={styles.phone}>{formatPhone(producer.whatsapp)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProducerCard;