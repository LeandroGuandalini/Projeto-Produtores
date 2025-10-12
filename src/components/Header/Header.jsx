import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import SearchBar from '../SearchBar/SearchBar';
import styles from './Header.module.css';

const Header = ({ currentPage, setCurrentPage }) => {
  const { currentUser, logout } = useApp();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setCurrentPage('home');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo} onClick={() => setCurrentPage('home')}>
          <span className={styles.logoIcon}>🌱</span>
          <h1>Produtos Locais</h1>
        </div>

        <div className={styles.searchContainer}>
          <SearchBar />
        </div>

        <nav className={`${styles.nav} ${showMobileMenu ? styles.navOpen : ''}`}>
          <button 
            className={`${styles.navBtn} ${currentPage === 'home' ? styles.active : ''}`}
            onClick={() => {
              setCurrentPage('home');
              setShowMobileMenu(false);
            }}
          >
            Início
          </button>
          <button 
            className={`${styles.navBtn} ${currentPage === 'products' ? styles.active : ''}`}
            onClick={() => {
              setCurrentPage('products');
              setShowMobileMenu(false);
            }}
          >
            Produtos
          </button>
          <button 
            className={`${styles.navBtn} ${currentPage === 'producers' ? styles.active : ''}`}
            onClick={() => {
              setCurrentPage('producers');
              setShowMobileMenu(false);
            }}
          >
            Produtores
          </button>
          
          <div className={styles.navActions}>
            {currentUser ? (
              <div className={styles.userMenu}>
                <button 
                  className={styles.userButton}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <span className={styles.userName}>👤 {currentUser.name}</span>
                </button>
                {showUserMenu && (
                  <div className={styles.userDropdown}>
                    <div className={styles.userInfo}>
                      <strong>{currentUser.name}</strong>
                      <span>{currentUser.email}</span>
                    </div>
                    <button 
                      className={styles.dropdownItem}
                      onClick={() => {
                        setCurrentPage('add-product');
                        setShowUserMenu(false);
                        setShowMobileMenu(false);
                      }}
                    >
                      Cadastrar Produto
                    </button>
                    <button 
                      className={styles.dropdownItem}
                      onClick={handleLogout}
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button 
                  className={styles.btnSecondary}
                  onClick={() => {
                    setCurrentPage('login');
                    setShowMobileMenu(false);
                  }}
                >
                  Entrar
                </button>
                <button 
                  className={styles.btnPrimary}
                  onClick={() => {
                    setCurrentPage('register');
                    setShowMobileMenu(false);
                  }}
                >
                  Cadastrar
                </button>
              </>
            )}
          </div>
        </nav>

        <button 
          className={styles.menuToggle}
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;