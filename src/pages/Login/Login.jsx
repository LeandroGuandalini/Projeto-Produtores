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

  const fillDemoCredentials = (email, password) => {
    setFormData({
      email,
      password
    });
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

          <div className={styles.demo}>
            <h3>Contas de Demonstração:</h3>
            <div className={styles.demoAccounts}>
              <div className={styles.demoAccount}>
                <p><strong>Fazenda Esperança</strong></p>
                <p>Email: <span className={styles.demoEmail}>fazenda.esperanca@email.com</span></p>
                <p>Senha: <span className={styles.demoPassword}>123456</span></p>
                <button 
                  className={styles.demoButton}
                  onClick={() => fillDemoCredentials('fazenda.esperanca@email.com', '123456')}
                >
                  Usar esta conta
                </button>
              </div>
              
              <div className={styles.demoAccount}>
                <p><strong>Sítio do Seu Zé</strong></p>
                <p>Email: <span className={styles.demoEmail}>sitio.ze@email.com</span></p>
                <p>Senha: <span className={styles.demoPassword}>123456</span></p>
                <button 
                  className={styles.demoButton}
                  onClick={() => fillDemoCredentials('sitio.ze@email.com', '123456')}
                >
                  Usar esta conta
                </button>
              </div>
              
              <div className={styles.demoAccount}>
                <p><strong>Chácara da Maria</strong></p>
                <p>Email: <span className={styles.demoEmail}>chacara.maria@email.com</span></p>
                <p>Senha: <span className={styles.demoPassword}>123456</span></p>
                <button 
                  className={styles.demoButton}
                  onClick={() => fillDemoCredentials('chacara.maria@email.com', '123456')}
                >
                  Usar esta conta
                </button>
              </div>
            </div>
          </div>

          <div className={styles.switch}>
            <p>Não tem uma conta?</p>
            <button 
              onClick={onSwitchToRegister}
              className={styles.switchButton}
            >
              Cadastrar como Produtor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;