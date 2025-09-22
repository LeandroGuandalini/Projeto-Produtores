import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [products, setProducts] = useState([]);
  const [producers, setProducers] = useState([]);


  useEffect(() => {
    const sampleProducers = [
      {
        id: 1,
        name: "Fazenda Esperança",
        whatsapp: "5511999999999",
        location: "São Paulo, SP",
        description: "Produtos orgânicos cultivados com amor"
      },
      {
        id: 2,
        name: "Sítio do Seu Zé",
        whatsapp: "5511888888888",
        location: "Minas Gerais, MG",
        description: "Frutas e verduras fresquinhas"
      }
    ];

    const sampleProducts = [
      {
        id: 1,
        name: "Tomate Orgânico",
        price: 8.50,
        description: "Tomates frescos colhidos diariamente",
        image: "https://images.unsplash.com/photo-1546470427-e212b6e9b45e?w=300",
        producerId: 1,
        category: "Hortaliças"
      },
      {
        id: 2,
        name: "Banana Prata",
        price: 4.20,
        description: "Bananas maduras e doces",
        image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300",
        producerId: 2,
        category: "Frutas"
      }
    ];

    setProducers(sampleProducers);
    setProducts(sampleProducts);
  }, []);

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <HomePage products={products} producers={producers} />;
      case 'products':
        return <ProductsPage products={products} />;
      case 'producers':
        return <ProducersPage producers={producers} />;
      case 'add-product':
        return <AddProductPage producers={producers} onAddProduct={(product) => {
          setProducts([...products, { ...product, id: products.length + 1 }]);
          setCurrentPage('products');
        }} />;
      case 'add-producer':
        return <AddProducerPage onAddProducer={(producer) => {
          setProducers([...producers, { ...producer, id: producers.length + 1 }]);
          setCurrentPage('producers');
        }} />;
      default:
        return <HomePage products={products} producers={producers} />;
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

// Componentes de Página Simples
const HomePage = ({ products, producers }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="page">
      <section className="hero">
        <div className="container">
          <h1>Conectando produtores rurais e consumidores</h1>
          <p>Encontre produtos frescos diretamente do produtor</p>
        </div>
      </section>

      <section className="products-section">
        <div className="container">
          <h2>Produtos em Destaque</h2>
          <div className="products-grid">
            {products.map(product => {
              const producer = producers.find(p => p.id === product.producerId);
              return (
                <div key={product.id} className="product-card">
                  <img src={product.image} alt={product.name} />
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="price">{formatPrice(product.price)}</p>
                    <p>{product.description}</p>
                    {producer && (
                      <div className="producer-info">
                        <small>Produtor: {producer.name}</small>
                      </div>
                    )}
                    <button className="whatsapp-btn">
                      💬 Contatar via WhatsApp
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

const ProductsPage = ({ products }) => {
  return (
    <div className="page">
      <div className="container">
        <h1>Todos os Produtos</h1>
        <p>{products.length} produtos encontrados</p>
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProducersPage = ({ producers }) => {
  return (
    <div className="page">
      <div className="container">
        <h1>Nossos Produtores</h1>
        <div className="producers-grid">
          {producers.map(producer => (
            <div key={producer.id} className="producer-card">
              <h3>{producer.name}</h3>
              <p>{producer.location}</p>
              <p>{producer.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AddProductPage = ({ producers, onAddProduct }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    producerId: '',
    category: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddProduct({
      ...formData,
      price: parseFloat(formData.price)
    });
  };

  return (
    <div className="page">
      <div className="container">
        <h1>Cadastrar Produto</h1>
        <form onSubmit={handleSubmit} className="form">
          <select 
            value={formData.producerId} 
            onChange={(e) => setFormData({...formData, producerId: e.target.value})}
            required
          >
            <option value="">Selecione um produtor</option>
            {producers.map(producer => (
              <option key={producer.id} value={producer.id}>
                {producer.name}
              </option>
            ))}
          </select>
          
          <input
            type="text"
            placeholder="Nome do produto"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          
          <input
            type="number"
            step="0.01"
            placeholder="Preço"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            required
          />
          
          <button type="submit">Cadastrar</button>
        </form>
      </div>
    </div>
  );
};

const AddProducerPage = ({ onAddProducer }) => {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    location: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddProducer(formData);
  };

  return (
    <div className="page">
      <div className="container">
        <h1>Cadastrar Produtor</h1>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Nome do produtor"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          
          <input
            type="text"
            placeholder="WhatsApp"
            value={formData.whatsapp}
            onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
            required
          />
          
          <button type="submit">Cadastrar</button>
        </form>
      </div>
    </div>
  );
};

export default App;