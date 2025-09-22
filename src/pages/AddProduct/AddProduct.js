// pages/AddProduct/AddProduct.js
import React, { useState } from 'react';
import './AddProduct.css';

const AddProduct = ({ producers, onAddProduct }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    producerId: '',
    category: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.producerId) {
      alert('Por favor, selecione um produtor');
      return;
    }

    onAddProduct({
      ...formData,
      price: parseFloat(formData.price)
    });

    // Limpar formulário
    setFormData({
      name: '',
      price: '',
      description: '',
      image: '',
      producerId: '',
      category: ''
    });
  };

  return (
    <div className="add-product">
      <div className="container">
        <h1>Cadastrar Novo Produto</h1>
        
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="producerId">Produtor *</label>
            <select 
              id="producerId"
              name="producerId" 
              value={formData.producerId} 
              onChange={handleChange}
              required
            >
              <option value="">Selecione um produtor</option>
              {producers.map(producer => (
                <option key={producer.id} value={producer.id}>
                  {producer.name} - {producer.location}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="name">Nome do Produto *</label>
            <input 
              type="text" 
              id="name"
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Preço (R$) *</label>
            <input 
              type="number" 
              id="price"
              name="price" 
              step="0.01"
              value={formData.price} 
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Categoria</label>
            <select 
              id="category"
              name="category" 
              value={formData.category} 
              onChange={handleChange}
            >
              <option value="">Selecione uma categoria</option>
              <option value="Frutas">Frutas</option>
              <option value="Verduras">Verduras</option>
              <option value="Legumes">Legumes</option>
              <option value="Laticínios">Laticínios</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <textarea 
              id="description"
              name="description" 
              value={formData.description} 
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">URL da Imagem</label>
            <input 
              type="url" 
              id="image"
              name="image" 
              value={formData.image} 
              onChange={handleChange}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>

          <button type="submit" className="submit-btn">
            Cadastrar Produto
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;