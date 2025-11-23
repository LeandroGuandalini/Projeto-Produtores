import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Products from './pages/Products/Products';
import Producers from './pages/Producers/Producers';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Favorites from './components/Favorites/Favorites';
import AddProduct from './pages/AddProduct/AddProduct';
import './App.css';

// Componentes simples para páginas que podem estar com problemas
const AddProducer = () => (
  <div className="container">
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Cadastrar Produtor</h1>
      <p>Funcionalidade em desenvolvimento</p>
    </div>
  </div>
);

const Register = ({ onSuccess, onSwitchToLogin }) => (
  <div className="container">
    <div style={{ 
      maxWidth: '500px', 
      margin: '2rem auto', 
      padding: '2rem',
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Cadastro</h1>
      <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#666' }}>
        Crie sua conta de produtor
      </p>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Nome
        </label>
        <input 
          type="text" 
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
          placeholder="Seu nome completo"
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Email
        </label>
        <input 
          type="email" 
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
          placeholder="seu@email.com"
        />
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Senha
        </label>
        <input 
          type="password" 
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
          placeholder="Sua senha"
        />
      </div>

      <button 
        onClick={onSuccess}
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
          color: 'white',
          border: 'none',
          padding: '1rem',
          borderRadius: '4px',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Cadastrar
      </button>

      <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #ddd' }}>
        <p style={{ color: '#666', marginBottom: '1rem' }}>Já tem uma conta?</p>
        <button 
          onClick={onSwitchToLogin}
          style={{
            background: 'none',
            border: '2px solid #28a745',
            color: '#28a745',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Fazer Login
        </button>
      </div>
    </div>
  </div>
);

const EditProduct = ({ productId, onSuccess, onCancel }) => (
  <div className="container">
    <div style={{ padding: '2rem' }}>
      <button onClick={onCancel} style={{ marginBottom: '2rem' }}>
        ← Voltar
      </button>
      <h1>Editar Produto #{productId}</h1>
      <p>Funcionalidade em desenvolvimento</p>
      <button onClick={onSuccess}>Salvar Alterações</button>
    </div>
  </div>
);

const Analytics = () => (
  <div className="container">
    <div style={{ padding: '2rem' }}>
      <h1>Analytics</h1>
      <p>Funcionalidade em desenvolvimento</p>
    </div>
  </div>
);

// Componente principal da aplicação
function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);

  const handleEditProduct = (productId) => {
    setEditingProductId(productId);
    setCurrentPage('edit-product');
  };

  const handleAddProduct = () => {
    setCurrentPage('add-product');
  };

  const handleAddProductSuccess = () => {
    setCurrentPage('dashboard');
    alert('Produto cadastrado com sucesso!');
  };

  const renderPage = () => {
    console.log('Renderizando página:', currentPage);
    
    try {
      switch(currentPage) {
        case 'home':
          return <Home onProductSelect={(product) => {
            setSelectedProduct(product);
            setCurrentPage('product-detail');
          }} />;
        
        case 'products':
          return <Products onProductSelect={(product) => {
            setSelectedProduct(product);
            setCurrentPage('product-detail');
          }} />;
        
        case 'producers':
          return <Producers />;
        
        case 'add-product':
          return <AddProduct onSuccess={handleAddProductSuccess} />;
        
        case 'add-producer':
          return <AddProducer />;
        
        case 'product-detail':
          if (!selectedProduct) {
            return (
              <div className="container">
                <button onClick={() => setCurrentPage('home')}>
                  ← Voltar
                </button>
                <p>Produto não encontrado</p>
              </div>
            );
          }
          return <ProductDetail 
            product={selectedProduct} 
            onBack={() => setCurrentPage('home')} 
          />;
        
        case 'login':
          return <Login 
            onSuccess={() => setCurrentPage('home')}
            onSwitchToRegister={() => setCurrentPage('register')}
          />;
        
        case 'register':
          return <Register 
            onSuccess={() => setCurrentPage('home')}
            onSwitchToLogin={() => setCurrentPage('login')}
          />;
        
        case 'dashboard':
          return <Dashboard 
            onEditProduct={handleEditProduct}
            onAddProduct={handleAddProduct}
          />;
        
        case 'edit-product':
          return <EditProduct 
            productId={editingProductId}
            onSuccess={() => {
              setCurrentPage('dashboard');
              setEditingProductId(null);
            }}
            onCancel={() => {
              setCurrentPage('dashboard');
              setEditingProductId(null);
            }}
          />;
        
        case 'analytics':
          return <Analytics />;
        
        default:
          return <Home onProductSelect={(product) => {
            setSelectedProduct(product);
            setCurrentPage('product-detail');
          }} />;
      }
    } catch (error) {
      console.error('Erro ao renderizar página:', error);
      return (
        <div className="container">
          <h1>Erro ao carregar página</h1>
          <p>{error.message}</p>
          <button onClick={() => setCurrentPage('home')}>
            Voltar para Home
          </button>
        </div>
      );
    }
  };

  return (
    <div className="App">
      <Header 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        onShowFavorites={() => setShowFavorites(true)}
      />
      
      <main>
        {renderPage()}
      </main>

      <Favorites 
        isOpen={showFavorites}
        onClose={() => setShowFavorites(false)}
      />
    </div>
  );
}

// Componente App principal
function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;