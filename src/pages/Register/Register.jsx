import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { validateEmail, validatePhone, validateRequired } from '../../utils/validators';
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
      newErrors.name = 'Nome é obrigatório';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!validateRequired(formData.password)) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
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

    setIsLoading(true);

    try {
      const result = registerProducer({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        whatsapp: formData.whatsapp,
        location: formData.location,
        description: formData.description,
        image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=300'
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
                  required
                />
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
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
                  className={`${styles.input} ${errors.email ? styles.error : ''}`}
                  placeholder="seu@email.com"
                  required
                />
                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
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
                  className={`${styles.input} ${errors.password ? styles.error : ''}`}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
                {errors.password && <span className={styles.errorText}>{errors.password}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  Confirmar Senha *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.confirmPassword ? styles.error : ''}`}
                  placeholder="Digite a senha novamente"
                  required
                />
                {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
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
                  className={`${styles.input} ${errors.whatsapp ? styles.error : ''}`}
                  placeholder="(11) 99999-9999"
                  required
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
                  required
                />
                {errors.location && <span className={styles.errorText}>{errors.location}</span>}
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
                rows="3"
                placeholder="Descreva seu negócio..."
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