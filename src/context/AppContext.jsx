import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

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
  const [currentUser, setCurrentUser] = useLocalStorage('currentUser', null);
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
          image: "https://picsum.photos/id/1000/300/300", // Fazenda
          categories: ["Hortaliças", "Frutas", "Orgânicos"],
          email: "fazenda.esperanca@email.com",
          password: "123456"
        },
        {
          id: 2,
          name: "Sítio do Seu Zé",
          whatsapp: "5511888888888",
          location: "Minas Gerais, MG",
          description: "Frutas e verduras fresquinhas direto da roça para sua mesa.",
          image: "https://picsum.photos/id/1001/300/300", // Sítio
          categories: ["Frutas", "Verduras"],
          email: "sitio.ze@email.com",
          password: "123456"
        },
        {
          id: 3,
          name: "Chácara da Maria",
          whatsapp: "5511777777777",
          location: "Rio de Janeiro, RJ",
          description: "Produtos artesanais e caseiros com receita da vovó.",
          image: "https://picsum.photos/id/1002/300/300", // Chácara
          categories: ["Laticínios", "Artesanato"],
          email: "chacara.maria@email.com",
          password: "123456"
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
          image: "https://picsum.photos/id/1080/400/300", // Tomate
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
          image: "https://picsum.photos/id/109/400/300", // Banana
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
          image: "https://picsum.photos/id/133/400/300", // Queijo
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
          image: "https://picsum.photos/id/112/400/300", // Alface
          producerId: 1,
          category: "Verduras",
          unit: "unidade",
          available: true,
          featured: true
        },
        {
          id: 5,
          name: "Laranja Pera",
          price: 5.80,
          description: "Laranjas suculentas e doces, ideais para sucos naturais.",
          image: "https://picsum.photos/id/119/400/300", // Laranja
          producerId: 2,
          category: "Frutas",
          unit: "kg",
          available: true,
          featured: true
        },
        {
          id: 6,
          name: "Cenoura",
          price: 4.90,
          description: "Cenouras frescas e crocantes, perfeitas para saladas e cozidos.",
          image: "https://picsum.photos/id/122/400/300", // Cenoura
          producerId: 1,
          category: "Legumes",
          unit: "kg",
          available: true,
          featured: false
        }
      ];
      setProducts(initialProducts);
    }
  }, [producers.length, products.length, setProducers, setProducts]);

  // Funções de autenticação
  const login = (email, password) => {
    const producer = producers.find(p => p.email === email && p.password === password);
    if (producer) {
      setCurrentUser(producer);
      return { success: true, producer };
    }
    return { success: false, error: 'Email ou senha incorretos' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const registerProducer = (producerData) => {
    const existingProducer = producers.find(p => p.email === producerData.email);
    if (existingProducer) {
      return { success: false, error: 'Email já cadastrado' };
    }

    const newProducer = {
      ...producerData,
      id: Date.now(),
      categories: [],
      image: "https://picsum.photos/id/177/300/300" // Imagem padrão para novos produtores
    };

    setProducers(prev => [...prev, newProducer]);
    setCurrentUser(newProducer);
    
    return { success: true, producer: newProducer };
  };

  // Modificar addProduct para usar o produtor logado
  const addProduct = (newProduct) => {
    if (!currentUser) {
      throw new Error('Você precisa estar logado para cadastrar produtos');
    }

    const productWithId = {
      ...newProduct,
      id: Date.now(),
      producerId: currentUser.id, // Sempre usa o ID do produtor logado
      createdAt: new Date().toISOString(),
      available: true,
      featured: false,
      image: newProduct.image || "https://picsum.photos/id/292/400/300" // Imagem padrão para novos produtos
    };
    
    setProducts(prev => [...prev, productWithId]);
    return productWithId;
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

  // Produtos do produtor logado
  const myProducts = currentUser 
    ? products.filter(product => product.producerId === currentUser.id)
    : [];

  const value = {
    // Estado
    producers,
    products: filteredProducts,
    allProducts: products,
    featuredProducts,
    myProducts,
    categories,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    currentUser,
    
    // Ações
    login,
    logout,
    registerProducer,
    addProduct,
    setCurrentUser,
    getProducerById: (id) => producers.find(p => p.id === id)
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};