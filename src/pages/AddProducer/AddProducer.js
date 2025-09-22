// pages/AddProducer/AddProducer.js
import React, { useState } from 'react';
import { useApp } from '../../src/context/AppContext';
import { validatePhone, validateRequired } from '../../utils/validators';
import styles from './AddProducer.module.css';

const AddProducer = () => {
  const { addProducer } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    location: '',
    description: '',
    image: '',
    categories: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableCategories = ['Frutas', 'Verduras', 'Legumes', 'Laticínios', 'Orgânicos', 'Artesanato', 'Outros'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCategoryToggle = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateRequired(formData.name)) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!validatePhone(formData.whatsapp)) {
      newErrors.whatsapp = 'WhatsApp inválido';
    }

    if (!validateRequired(formData.location)) {
      newErrors.location = 'Localização é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await addProducer(formData);
      
      // Reset form
      setFormData({
        name: '',
        whatsapp: '',
        location: '',
        description: '',
        image: '',
        categories: []
      });
      
      alert('Produtor cadastrado com sucesso!');
    } catch (error) {
      alert('Erro ao cadastrar produtor. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.addProducer}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Cadastrar Novo Produtor</h1>
          <p className={styles.subtitle}>
            Adicione um produtor local à nossa plataforma
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Nome do Produtor *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`${styles.input} ${errors.name ? styles.error : ''}`}
                placeholder="Ex: Fazenda Esperança"
              />
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="whatsapp" className={styles.label}>
                WhatsApp *
              </label>
              <input
                type="tel"
                id="whatsapp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                className={`${styles.input} ${errors.whatsapp ? styles.error : ''}`}
                placeholder="Ex: (11) 99999-9999"
              />
              {errors.whatsapp && <span className={styles.errorText}>{errors.whatsapp}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="location" className={styles.label}>
                Localização *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`${styles.input} ${errors.location ? styles.error : ''}`}
                placeholder="Ex: São Paulo, SP"
              />
              {errors.location && <span className={styles.errorText}>{errors.location}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="image" className={styles.label}>
                URL da Imagem
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className={styles.input}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.textarea}
              rows="4"
              placeholder="Descreva o produtor e seus produtos..."
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Categorias
            </label>
            <div className={styles.categoriesGrid}>
              {availableCategories.map(category => (
                <label key={category} className={styles.categoryLabel}>
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className={styles.checkbox}
                  />
                  <span className={styles.categoryText}>{category}</span>
                </label>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Cadastrando...' : 'Cadastrar Produtor'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProducer;