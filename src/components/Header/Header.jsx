import React from 'react';

const Header = ({ currentPage, setCurrentPage }) => {
  return (
    <header className="header">
      <div className="container">
        <div className="logo" onClick={() => setCurrentPage('home')}>
          <h1>🌱 Produtos Locais</h1>
        </div>
        
        <nav className="nav">
          <button 
            className={currentPage === 'home' ? 'active' : ''}
            onClick={() => setCurrentPage('home')}
          >
            Início
          </button>
          <button 
            className={currentPage === 'products' ? 'active' : ''}
            onClick={() => setCurrentPage('products')}
          >
            Produtos
          </button>
          <button 
            className={currentPage === 'producers' ? 'active' : ''}
            onClick={() => setCurrentPage('producers')}
          >
            Produtores
          </button>
          
          <div className="nav-actions">
            <button onClick={() => setCurrentPage('add-product')}>
              Cadastrar Produto
            </button>
            <button onClick={() => setCurrentPage('add-producer')}>
              Cadastrar Produtor
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;