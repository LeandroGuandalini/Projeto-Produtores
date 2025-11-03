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
  const [favorites, setFavorites] = useLocalStorage('favorites', []);
  const [conversationHistory, setConversationHistory] = useLocalStorage('conversationHistory', []);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    maxPrice: '',
    location: ''
  });

  // Dados iniciais FIXOS
  const initialProducers = [
    {
      id: 1,
      name: "Fazenda Esperança",
      whatsapp: "5511999999999",
      location: "São Paulo, SP",
      description: "Produtos orgânicos cultivados com amor e cuidado, sem agrotóxicos.",
      image: "https://picsum.photos/id/1000/300/300",
      categories: ["Hortaliças", "Frutas", "Orgânicos"],
      email: "fazenda.esperanca@email.com",
      password: "123456",
      type: "producer"
    },
    {
      id: 2,
      name: "Sítio do Seu Zé",
      whatsapp: "5511888888888",
      location: "Minas Gerais, MG",
      description: "Frutas e verduras fresquinhas direto da roça para sua mesa.",
      image: "https://picsum.photos/id/1001/300/300",
      categories: ["Frutas", "Verduras"],
      email: "sitio.ze@email.com",
      password: "123456",
      type: "producer"
    },
    {
      id: 3,
      name: "Chácara da Maria",
      whatsapp: "5511777777777",
      location: "Rio de Janeiro, RJ",
      description: "Produtos artesanais e caseiros com receita da vovó.",
      image: "https://picsum.photos/id/1002/300/300",
      categories: ["Laticínios", "Artesanato"],
      email: "chacara.maria@email.com",
      password: "123456",
      type: "producer"
    }
  ];

  const initialProducts = [
    {
      id: 1,
      name: "Tomate Orgânico",
      price: 8.50,
      description: "Tomates frescos colhidos diariamente, cultivados sem agrotóxicos. Perfeitos para saladas e molhos.",
      image: "https://picsum.photos/id/1080/400/300",
      producerId: 1,
      category: "Hortaliças",
      unit: "kg",
      quantity: 50,
      available: true,
      featured: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      name: "Banana Prata",
      price: 4.20,
      description: "Bananas maduras e doces, perfeitas para vitaminas e sobremesas. Colhidas no ponto ideal.",
      image: "https://picsum.photos/id/109/400/300",
      producerId: 2,
      category: "Frutas",
      unit: "cacho",
      quantity: 30,
      available: true,
      featured: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      name: "Queijo Minas",
      price: 25.90,
      description: "Queijo minas artesanal, feito com leite fresco e receita tradicional. Peso aproximado 1kg.",
      image: "https://picsum.photos/id/133/400/300",
      producerId: 3,
      category: "Laticínios",
      unit: "peça",
      quantity: 15,
      available: true,
      featured: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 4,
      name: "Alface Crespa",
      price: 3.50,
      description: "Alface crespa fresquinha, ideal para saladas. Colhida na manhã da entrega.",
      image: "https://picsum.photos/id/112/400/300",
      producerId: 1,
      category: "Verduras",
      unit: "unidade",
      quantity: 100,
      available: true,
      featured: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 5,
      name: "Laranja Pera",
      price: 5.80,
      description: "Laranjas suculentas e doces, ideais para sucos naturais.",
      image: "https://picsum.photos/id/119/400/300",
      producerId: 2,
      category: "Frutas",
      unit: "kg",
      quantity: 80,
      available: true,
      featured: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 6,
      name: "Cenoura",
      price: 4.90,
      description: "Cenouras frescas e crocantes, perfeitas para saladas e cozidos.",
      image: "https://picsum.photos/id/122/400/300",
      producerId: 1,
      category: "Legumes",
      unit: "kg",
      quantity: 60,
      available: true,
      featured: false,
      createdAt: new Date().toISOString()
    }
  ];

  // Carregar dados iniciais
  useEffect(() => {
    console.log('Inicializando dados...');
    setProducers(initialProducers);
    setProducts(initialProducts);
  }, []);

  // Funções de autenticação
  const login = (email, password) => {
    console.log('=== TENTATIVA DE LOGIN ===');
    console.log('Email digitado:', email);
    console.log('Senha digitada:', password);
    
    const producer = producers.find(p => {
      const match = p.email === email && p.password === password;
      console.log(`Verificando ${p.email}: ${p.password} - Match: ${match}`);
      return match;
    });
    
    if (producer) {
      console.log('✅ LOGIN BEM-SUCEDIDO:', producer.name);
      setCurrentUser(producer);
      return { success: true, producer };
    }
    
    console.log('❌ LOGIN FALHOU');
    console.log('Produtores disponíveis:', producers.map(p => ({ email: p.email, senha: p.password })));
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
      image: "https://picsum.photos/id/177/300/300",
      type: "producer"
    };

    setProducers(prev => [...prev, newProducer]);
    setCurrentUser(newProducer);
    
    return { success: true, producer: newProducer };
  };

  // Funções de produtos
  const addProduct = (newProduct) => {
    if (!currentUser) {
      throw new Error('Você precisa estar logado para cadastrar produtos');
    }

    const productWithId = {
      ...newProduct,
      id: Date.now(),
      producerId: currentUser.id,
      createdAt: new Date().toISOString(),
      available: true,
      featured: false,
      quantity: newProduct.quantity || 0,
      image: newProduct.image || "https://picsum.photos/id/292/400/300"
    };
    
    setProducts(prev => [...prev, productWithId]);
    return productWithId;
  };

  const updateProduct = (productId, updatedData) => {
    if (!currentUser) {
      throw new Error('Você precisa estar logado para editar produtos');
    }

    setProducts(prev => prev.map(product => 
      product.id === productId && product.producerId === currentUser.id
        ? { ...product, ...updatedData, updatedAt: new Date().toISOString() }
        : product
    ));
  };

  const deleteProduct = (productId) => {
    if (!currentUser) {
      throw new Error('Você precisa estar logado para excluir produtos');
    }

    setProducts(prev => prev.filter(product => 
      !(product.id === productId && product.producerId === currentUser.id)
    ));
  };

  // Funções de favoritos
  const addToFavorites = (product) => {
    setFavorites(prev => {
      if (prev.find(fav => fav.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromFavorites = (productId) => {
    setFavorites(prev => prev.filter(fav => fav.id !== productId));
  };

  // Funções de histórico de conversas
  const addToConversationHistory = (conversationData) => {
    const conversation = {
      ...conversationData,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    
    setConversationHistory(prev => [conversation, ...prev.slice(0, 49)]);
  };

  const clearConversationHistory = () => {
    setConversationHistory([]);
  };

  // Função de WhatsApp com histórico
  const handleWhatsAppClick = (product, producer) => {
    const message = `Olá! Gostaria de saber mais sobre o produto: ${product.name}`;
    const whatsappUrl = `https://wa.me/${producer.whatsapp}?text=${encodeURIComponent(message)}`;
    
    // Registrar no histórico
    addToConversationHistory({
      productName: product.name,
      producerName: producer.name,
      phone: producer.whatsapp,
      productId: product.id,
      producerId: producer.id
    });
    
    window.open(whatsappUrl, '_blank');
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
    favorites,
    conversationHistory,
    
    // Ações
    login,
    logout,
    registerProducer,
    addProduct,
    updateProduct,
    deleteProduct,
    setCurrentUser,
    getProducerById: (id) => producers.find(p => p.id === id),
    addToFavorites,
    removeFromFavorites,
    addToConversationHistory,
    clearConversationHistory,
    handleWhatsAppClick
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};