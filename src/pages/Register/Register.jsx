// pages/Register/Register.jsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import styles from './Register.module.css';

const Register = ({ onSuccess, onSwitchToLogin }) => {
  const { registerProducer } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    whatsapp: '',
    location: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = registerProducer({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        whatsapp: formData.whatsapp,
        location: formData.location,
        description: formData.description
      });

      if (result.success) {
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setErrors({ general: result.error });
      }
    } catch (err) {
      setErrors({ general: 'Erro ao cadastrar produtor' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.register}>
      <div className="container">
        <div className={styles.card}>
          <h1 className={styles.title}>Cadastro de Produtor</h1>
          <p className={styles.subtitle}>Crie sua conta para começar a vender</p>

          {errors.general && (
            <div className={styles.error}>
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
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
                className={styles.input}
                placeholder="Ex: Fazenda Esperança"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Senha *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="whatsapp" className={styles.label}>
                WhatsApp *
              </label>
              <input
                type="text"
                id="whatsapp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                className={styles.input}
                placeholder="(11) 99999-9999"
                required
              />
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
                className={styles.input}
                placeholder="Ex: São Paulo, SP"
                required
              />
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Cadastrando...' : 'Cadastrar Produtor'}
            </button>
          </form>

          <div className={styles.switch}>
            <p>Já tem uma conta?</p>
            <button 
              onClick={onSwitchToLogin}
              className={styles.switchButton}
            >
              Fazer Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;