import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { validatePrice, validateRequired } from '../../utils/validators';
import styles from './EditProduct.module.css';

const EditProduct = ({ productId, onSuccess, onCancel }) => {
  const { currentUser, myProducts, updateProduct } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: '',
    unit: 'unidade',
    available: true,
    featured: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableCategories = ['Frutas', 'Verduras', 'Legumes', 'Hortaliças', 'Laticínios', 'Orgânicos', 'Outros'];
  const availableUnits = ['unidade', 'kg', 'g', 'litro', 'ml', 'cacho', 'pacote', 'peça'];

  useEffect(() => {
    if (productId) {
      const product = myProducts.find(p => p.id === productId);
      if (product) {
        setFormData({
          name: product.name,
          price: product.price,
          description: product.description,
          image: product.image,
          category: product.category,
          unit: product.unit,
          available: product.available,
          featured: product.featured
        });
      }
    }
  }, [productId, myProducts]);

  if (!currentUser) {
    return (
      <div className={styles.editProduct}>
        <div className="container">
          <div className={styles.notLoggedIn}>
            <h2>🔒 Acesso Restrito</h2>
            <p>Você precisa estar logado como produtor para editar produtos.</p>
          </div>
        </div>
      </div>
    );
  }

  const product = myProducts.find(p => p.id === productId);
  if (!product) {
    return (
      <div className={styles.editProduct}>
        <div className="container">
          <div className={styles.notFound}>
            <h2>Produto não encontrado</h2>
            <p>O produto que você está tentando editar não existe ou não pertence a você.</p>
            <button onClick={onCancel} className={styles.backButton}>
              ← Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await updateProduct(productId, {
        ...formData,
        price: parseFloat(formData.price)
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      alert('Erro ao atualizar produto: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.editProduct}>
      <div className="container">
        <div className={styles.header}>
          <button onClick={onCancel} className={styles.backButton}>
            ← Voltar
          </button>
          <h1>Editar Produto</h1>
          <p>Atualize as informações do seu produto</p>
        </div>

        <div className={styles.currentImage}>
          <img src={product.image} alt={product.name} />
          <span>Imagem atual do produto</span>
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
                Cole a URL de uma imagem do produto. Deixe em branco para manter a imagem atual.
              </small>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Descrição do Produto
            </label>
            <textarea 
              id="description"
              name="description" 
              value={formData.description} 
              onChange={handleChange}
              className={styles.textarea}
              rows="4"
              placeholder="Descreva seu produto de forma atrativa para os clientes..."
            />
            <small className={styles.helpText}>
              Uma boa descrição ajuda os clientes a entenderem melhor seu produto.
            </small>
          </div>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleChange}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>
                <strong>Produto disponível para venda</strong>
                <small>Quando desmarcado, o produto não aparecerá para os clientes</small>
              </span>
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>
                <strong>Destacar este produto</strong>
                <small>Produtos destacados aparecem na página inicial</small>
              </span>
            </label>
          </div>

          <div className={styles.formActions}>
            <button 
              type="button" 
              onClick={onCancel}
              className={styles.cancelButton}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;