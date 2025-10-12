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
import './App.css';

function AppContent() {
  const { currentUser } = useApp();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

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
        // Se não estiver logado, redireciona para login
        if (!currentUser) {
          setAuthMode('login');
          return <Login 
            onSuccess={() => setCurrentPage('add-product')}
            onSwitchToRegister={() => setAuthMode('register')}
          />;
        }
        return <AddProduct onSuccess={() => setCurrentPage('products')} />;
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
      default:
        return <Home onProductSelect={(product) => {
          setSelectedProduct(product);
          setCurrentPage('product-detail');
        }} />;
    }
  };

  return (
    <div className="App">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main>
        {renderPage()}
      </main>
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