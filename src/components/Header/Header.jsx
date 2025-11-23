import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import SearchBar from '../SearchBar/SearchBar';
import styles from './Header.module.css';

const Header = ({ currentPage, setCurrentPage, onShowFavorites }) => {
  const { currentUser, logout, favorites } = useApp();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setCurrentPage('home');
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setShowMobileMenu(false);
    setShowUserMenu(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo} onClick={() => handleNavigation('home')}>
          <span className={styles.logoIcon}>🌱</span>
          <h1>Produtos Locais</h1>
        </div>

        <div className={styles.searchContainer}>
          <SearchBar />
        </div>

        {/* Botão de Favoritos */}
        <div className={styles.actionButtons}>
          <button 
            className={styles.actionBtn}
            onClick={onShowFavorites}
            title="Favoritos"
          >
            ⭐
            {favorites.length > 0 && (
              <span className={styles.badge}>{favorites.length}</span>
            )}
          </button>
        </div>

        <nav className={`${styles.nav} ${showMobileMenu ? styles.navOpen : ''}`}>
          <button 
            className={`${styles.navBtn} ${currentPage === 'home' ? styles.active : ''}`}
            onClick={() => handleNavigation('home')}
          >
            Início
          </button>
          <button 
            className={`${styles.navBtn} ${currentPage === 'products' ? styles.active : ''}`}
            onClick={() => handleNavigation('products')}
          >
            Produtos
          </button>
          <button 
            className={`${styles.navBtn} ${currentPage === 'producers' ? styles.active : ''}`}
            onClick={() => handleNavigation('producers')}
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
                      onClick={() => handleNavigation('dashboard')}
                    >
                      📊 Meu Dashboard
                    </button>
                    <button 
                      className={styles.dropdownItem}
                      onClick={() => handleNavigation('add-product')}
                    >
                      ➕ Cadastrar Produto
                    </button>
                    <button 
                      className={styles.dropdownItem}
                      onClick={() => handleNavigation('analytics')}
                    >
                      📈 Analytics
                    </button>
                    <div className={styles.dropdownDivider}></div>
                    <button 
                      className={styles.dropdownItem}
                      onClick={handleLogout}
                    >
                      🚪 Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button 
                  className={styles.btnSecondary}
                  onClick={() => handleNavigation('login')}
                >
                  Entrar
                </button>
                <button 
                  className={styles.btnPrimary}
                  onClick={() => handleNavigation('register')}
                >
                  Cadastrar
                </button>
              </>
            )}
          </div>
        </nav>

        <button 
          className={`${styles.menuToggle} ${showMobileMenu ? styles.menuToggleOpen : ''}`}
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