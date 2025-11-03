import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Products from './pages/Products/Products';
import Producers from './pages/Producers/Producers';
import AddProduct from './pages/AddProduct/AddProduct';
import AddProducer from './pages/AddProducer/AddProducer';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import EditProduct from './pages/EditProduct/EditProduct';
import Analytics from './pages/Analytics/Analytics';
import Favorites from './components/Favorites/Favorites';
import ConversationHistory from './components/ConversationHistory/ConversationHistory';
import './App.css';

function AppContent() {
  const { currentUser } = useApp();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [showFavorites, setShowFavorites] = useState(false);
  const [showConversationHistory, setShowConversationHistory] = useState(false);

  const handleEditProduct = (productId) => {
    setEditingProductId(productId);
    setCurrentPage('edit-product');
  };

  const handleAddProduct = () => {
    setCurrentPage('add-product');
  };

  const renderPage = () => {
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
        if (!currentUser) {
          setAuthMode('login');
          return <Login 
            onSuccess={() => setCurrentPage('add-product')}
            onSwitchToRegister={() => setAuthMode('register')}
          />;
        }
        return <AddProduct onSuccess={() => setCurrentPage('dashboard')} />;
      case 'add-producer':
        return <AddProducer onSuccess={() => setCurrentPage('producers')} />;
      case 'product-detail':
        return <ProductDetail 
          product={selectedProduct} 
          onBack={() => setCurrentPage('home')} 
        />;
      case 'login':
        return <Login 
          onSuccess={() => setCurrentPage('home')}
          onSwitchToRegister={() => setAuthMode('register')}
        />;
      case 'register':
        return <Register 
          onSuccess={() => setCurrentPage('home')}
          onSwitchToLogin={() => setAuthMode('login')}
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
  };

  return (
    <div className="App">
      <Header 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        onShowFavorites={() => setShowFavorites(true)}
        onShowConversationHistory={() => setShowConversationHistory(true)}
      />
      <main>
        {renderPage()}
      </main>

      {/* Modais */}
      <Favorites 
        isOpen={showFavorites}
        onClose={() => setShowFavorites(false)}
      />
      
      <ConversationHistory 
        isOpen={showConversationHistory}
        onClose={() => setShowConversationHistory(false)}
      />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;