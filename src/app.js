// App.js
import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Products from './pages/Products/Products';
import Producers from './pages/Producers/Producers';
import AddProduct from './pages/AddProduct/AddProduct';
import AddProducer from './pages/AddProducer/AddProducer';
import ProductDetail from './pages/ProductDetail/ProductDetail';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <Home onProductSelect={setSelectedProduct} />;
      case 'products':
        return <Products onProductSelect={setSelectedProduct} />;
      case 'producers':
        return <Producers />;
      case 'add-product':
        return <AddProduct />;
      case 'add-producer':
        return <AddProducer />;
      case 'product-detail':
        return <ProductDetail product={selectedProduct} onBack={() => setCurrentPage('home')} />;
      default:
        return <Home onProductSelect={setSelectedProduct} />;
    }
  };

  return (
    <AppProvider>
      <div className="App">
        <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <main>
          {renderPage()}
        </main>
      </div>
    </AppProvider>
  );
}

export default App;