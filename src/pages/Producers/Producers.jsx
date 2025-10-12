// pages/Producers/Producers.js
import React from 'react';
import { useApp } from '../../context/AppContext';
import ProducerCard from '../../components/ProducerCard/ProducerCard';
import styles from './Producers.module.css';

const Producers = () => {
  const { producers } = useApp();

  return (
    <div className={styles.producers}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Nossos Produtores</h1>
          <p className={styles.subtitle}>
            Conheça os produtores locais que oferecem produtos frescos e de qualidade
          </p>
        </div>

        <div className={styles.producersGrid}>
          {producers.map(producer => (
            <ProducerCard key={producer.id} producer={producer} />
          ))}
        </div>

        {producers.length === 0 && (
          <div className={styles.emptyState}>
            <h3>Nenhum produtor cadastrado</h3>
            <p>Seja o primeiro a cadastrar um produtor na plataforma.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Producers;