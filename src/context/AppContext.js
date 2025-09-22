// src/context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [producers, setProducers] = useLocalStorage('producers', []);
  const [products, setProducts] = useLocalStorage('products', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    maxPrice: '',
    location: ''
  });

  // Carregar dados iniciais
  useEffect(() => {
    if (producers.length === 0) {
      const initialProducers = [
        {
          id: 1,
          name: "Fazenda Esperança",
          whatsapp: "5511999999999",
          location: "São Paulo, SP",
          description: "Produtos orgânicos cultivados com amor e cuidado, sem agrotóxicos.",
          image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=300",
          categories: ["Hortaliças", "Frutas", "Orgânicos"]
        },
        {
          id: 2,
          name: "Sítio do Seu Zé",
          whatsapp: "5511888888888",
          location: "Minas Gerais, MG",
          description: "Frutas e verduras fresquinhas direto da roça para sua mesa.",
          image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=300",
          categories: ["Frutas", "Verduras"]
        },
        {
          id: 3,
          name: "Chácara da Maria",
          whatsapp: "5511777777777",
          location: "Rio de Janeiro, RJ",
          description: "Produtos artesanais e caseiros com receita da vovó.",
          image: "https://images.unsplash.com/photo-1556909114-4d0d853e5e15?w=300",
          categories: ["Laticínios", "Artesanato"]
        }
      ];
      setProducers(initialProducers);
    }

    if (products.length === 0) {
      const initialProducts = [
        {
          id: 1,
          name: "Tomate Orgânico",
          price: 8.50,
          description: "Tomates frescos colhidos diariamente, cultivados sem agrotóxicos. Perfeitos para saladas e molhos.",
          image: "https://images.unsplash.com/photo-1546470427-e212b6e9b45e?w=400",
          producerId: 1,
          category: "Hortaliças",
          unit: "kg",
          available: true,
          featured: true
        },
        {
          id: 2,
          name: "Banana Prata",
          price: 4.20,
          description: "Bananas maduras e doces, perfeitas para vitaminas e sobremesas. Colhidas no ponto ideal.",
          image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400",
          producerId: 2,
          category: "Frutas",
          unit: "cacho",
          available: true,
          featured: true
        },
        {
          id: 3,
          name: "Queijo Minas",
          price: 25.90,
          description: "Queijo minas artesanal, feito com leite fresco e receita tradicional. Peso aproximado 1kg.",
          image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
          producerId: 3,
          category: "Laticínios",
          unit: "peça",
          available: true,
          featured: false
        },
        {
          id: 4,
          name: "Alface Crespa",
          price: 3.50,
          description: "Alface crespa fresquinha, ideal para saladas. Colhida na manhã da entrega.",
          image: "https://images.unsplash.com/photo-1592415486684-1d829f3d7126?w=400",
          producerId: 1,
          category: "Verduras",
          unit: "unidade",
          available: true,
          featured: true
        }
      ];
      setProducts(initialProducts);
    }
  }, [producers.length, products.length, setProducers, setProducts]);

  const addProduct = (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      available: true,
      featured: false
    };
    setProducts(prev => [...prev, productWithId]);
  };

  const addProducer = (newProducer) => {
    const producerWithId = {
      ...newProducer,
      id: Date.now()
    };
    setProducers(prev => [...prev, producerWithId]);
  };

  // Filtrar produtos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filters.category || product.category === filters.category;
    const matchesPrice = !filters.maxPrice || product.price <= parseFloat(filters.maxPrice);
    
    const producer = producers.find(p => p.id === product.producerId);
    const matchesLocation = !filters.location || 
                           (producer && producer.location.toLowerCase().includes(filters.location.toLowerCase()));

    return matchesSearch && matchesCategory && matchesPrice && matchesLocation && product.available;
  });

  const featuredProducts = products.filter(product => product.featured && product.available);
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  const value = {
    producers,
    products: filteredProducts,
    allProducts: products,
    featuredProducts,
    categories,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    addProduct,
    addProducer,
    getProducerById: (id) => producers.find(p => p.id === id)
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};