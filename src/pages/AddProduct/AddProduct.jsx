import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { validatePrice, validateRequired } from '../../utils/validators';
import styles from './AddProduct.module.css';

const AddProduct = ({ onSuccess }) => {
  const { currentUser, addProduct, defaultImages } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: '',
    unit: 'unidade'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableCategories = ['Frutas', 'Verduras', 'Legumes', 'Hortaliças', 'Laticínios', 'Orgânicos', 'Outros'];
  const availableUnits = ['unidade', 'kg', 'g', 'litro', 'ml', 'cacho', 'pacote', 'peça'];

  // Se não estiver logado, mostrar mensagem
  if (!currentUser) {
    return (
      <div className={styles.addProduct}>
        <div className="container">
          <div className={styles.notLoggedIn}>
            <h2>🔒 Acesso Restrito</h2>
            <p>Você precisa estar logado como produtor para cadastrar produtos.</p>
            <p>Faça login ou cadastre-se como produtor para continuar.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateRequired(formData.name)) {
      newErrors.name = 'Nome do produto é obrigatório';
    }

    if (!validatePrice(formData.price)) {
      newErrors.price = 'Preço deve ser um número maior que zero';
    }

    if (!validateRequired(formData.category)) {
      newErrors.category = 'Selecione uma categoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      console.log('Formulário inválido:', errors);
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Tentando cadastrar produto:', formData);
      
      // Se não tiver imagem, usar imagem padrão
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        image: formData.image || defaultImages.product
      };
      
      const newProduct = await addProduct(productData);
      console.log('Produto cadastrado com sucesso:', newProduct);
      
      // Reset form
      setFormData({
        name: '',
        price: '',
        description: '',
        image: '',
        category: '',
        unit: 'unidade'
      });
      
      // Navigate back
      if (onSuccess) {
        console.log('Chamando onSuccess');
        onSuccess();
      } else {
        console.log('onSuccess não definido');
        alert('Produto cadastrado com sucesso! Você pode verificar no seu dashboard.');
      }

    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      alert('Erro ao cadastrar produto: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.addProduct}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Cadastrar Novo Produto</h1>
          <p className={styles.subtitle}>
            Produtor: <strong>{currentUser.name}</strong>
          </p>
          <p className={styles.info}>
            Este produto será cadastrado em seu nome automaticamente.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Nome do Produto *
              </label>
              <input 
                type="text" 
                id="name"
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                className={`${styles.input} ${errors.name ? styles.error : ''}`}
                placeholder="Ex: Tomate Orgânico"
                required 
              />
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="price" className={styles.label}>
                Preço (R$) *
              </label>
              <input 
                type="number" 
                id="price"
                name="price" 
                step="0.01"
                min="0.01"
                value={formData.price} 
                onChange={handleChange}
                className={`${styles.input} ${errors.price ? styles.error : ''}`}
                placeholder="Ex: 8.50"
                required 
              />
              {errors.price && <span className={styles.errorText}>{errors.price}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="category" className={styles.label}>
                Categoria *
              </label>
              <select 
                id="category"
                name="category" 
                value={formData.category} 
                onChange={handleChange}
                className={`${styles.select} ${errors.category ? styles.error : ''}`}
                required
              >
                <option value="">Selecione uma categoria</option>
                {availableCategories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && <span className={styles.errorText}>{errors.category}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="unit" className={styles.label}>
                Unidade de Medida
              </label>
              <select 
                id="unit"
                name="unit" 
                value={formData.unit} 
                onChange={handleChange}
                className={styles.select}
              >
                {availableUnits.map(unit => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
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
              <small className={styles.helpText}>
                Deixe em branco para usar uma imagem padrão
              </small>
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
              placeholder="Descreva o produto..."
            />
          </div>

          <div className={styles.formActions}>
            <button 
              type="button" 
              onClick={() => window.history.back()}
              className={styles.cancelButton}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;