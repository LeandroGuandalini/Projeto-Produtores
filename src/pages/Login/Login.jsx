import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import styles from './Login.module.css';

const Login = ({ onSuccess, onSwitchToRegister }) => {
  const { login } = useApp();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = login(formData.email, formData.password);
      
      if (result.success) {
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.login}>
      <div className="container">
        <div className={styles.card}>
          <h1 className={styles.title}>Login do Produtor</h1>
          <p className={styles.subtitle}>Acesse sua conta para gerenciar seus produtos</p>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
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
                Senha
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                placeholder="Sua senha"
                required
              />
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className={styles.switch}>
            <p>Não tem uma conta?</p>
            <button 
              onClick={onSwitchToRegister}
              className={styles.switchButton}
            >
              Cadastrar como Produtor
            </button>
          </div>

          <div className={styles.demo}>
            <h3>Contas de Demonstração:</h3>
            <div className={styles.demoAccounts}>
              <p><strong>Email:</strong> fazenda.esperanca@email.com</p>
              <p><strong>Senha:</strong> 123456</p>
              <p><strong>Email:</strong> sitio.ze@email.com</p>
              <p><strong>Senha:</strong> 123456</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;