import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Criar o contexto
const AppContext = createContext();

// Estado inicial
const initialState = {
  products: [],
  producers: [],
  currentUser: null,
  searchTerm: '',
  filters: {
    category: '',
    maxPrice: '',
    location: ''
  },
  favorites: []
};

// Imagens padrão
const defaultImages = {
  product: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
  producer: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=300&fit=crop",
  farm: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop"
};

// Dados mockados iniciais com imagens que funcionam
const initialProducers = [
  {
    id: '1',
    name: 'Fazenda Esperança',
    email: 'fazenda.esperanca@email.com',
    password: '123456',
    whatsapp: '5511999999999',
    location: 'São Paulo, SP',
    description: 'Produtores de alimentos orgânicos há mais de 20 anos',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop',
    categories: ['Frutas', 'Verduras', 'Orgânicos']
  },
  {
    id: '2',
    name: 'Sítio do Seu Zé',
    email: 'sitio.ze@email.com',
    password: '123456',
    whatsapp: '5511888888888',
    location: 'Campinas, SP',
    description: 'Frutas frescas direto do sítio',
    image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=300&fit=crop',
    categories: ['Frutas', 'Legumes']
  },
  {
    id: '3',
    name: 'Chácara da Maria',
    email: 'chacara.maria@email.com',
    password: '123456',
    whatsapp: '5511777777777',
    location: 'Sorocaba, SP',
    description: 'Produtos artesanais e naturais',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
    categories: ['Laticínios', 'Artesanato', 'Orgânicos']
  }
];

const initialProducts = [
  {
    id: '1',
    name: 'Tomate Orgânico',
    price: 8.50,
    description: 'Tomates frescos colhidos diariamente, cultivados sem agrotóxicos',
    image: 'https://images.unsplash.com/photo-1546470427-e212b7d3106a?w=400&h=300&fit=crop',
    category: 'Frutas',
    unit: 'kg',
    producerId: '1',
    available: true,
    featured: true,
    quantity: 50,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Alface Crespa',
    price: 4.00,
    description: 'Alface crespa fresquinha, perfeita para saladas',
    image: 'https://images.unsplash.com/photo-1594282482383-1899ec5e93bd?w=400&h=300&fit=crop',
    category: 'Verduras',
    unit: 'unidade',
    producerId: '1',
    available: true,
    featured: false,
    quantity: 30,
    createdAt: new Date('2024-01-16')
  },
  {
    id: '3',
    name: 'Cenoura',
    price: 6.00,
    description: 'Cenouras doces e crocantes, ricas em vitamina A',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop',
    category: 'Legumes',
    unit: 'kg',
    producerId: '2',
    available: true,
    featured: true,
    quantity: 25,
    createdAt: new Date('2024-01-14')
  },
  {
    id: '4',
    name: 'Queijo Minas',
    price: 25.00,
    description: 'Queijo minas artesanal, feito com leite fresco',
    image: 'https://images.unsplash.com/photo-1566772940196-0e2e683db0bd?w=400&h=300&fit=crop',
    category: 'Laticínios',
    unit: 'kg',
    producerId: '3',
    available: true,
    featured: false,
    quantity: 15,
    createdAt: new Date('2024-01-13')
  },
  {
    id: '5',
    name: 'Banana Prata',
    price: 5.50,
    description: 'Bananas prata orgânicas, doces e saborosas',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop',
    category: 'Frutas',
    unit: 'cacho',
    producerId: '2',
    available: true,
    featured: true,
    quantity: 20,
    createdAt: new Date('2024-01-17')
  },
  {
    id: '6',
    name: 'Mel Puro',
    price: 35.00,
    description: 'Mel 100% puro, colhido de forma sustentável',
    image: 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=400&h=300&fit=crop',
    category: 'Artesanato',
    unit: 'kg',
    producerId: '3',
    available: true,
    featured: false,
    quantity: 10,
    createdAt: new Date('2024-01-12')
  }
];

// Reducer para gerenciar estado
function appReducer(state, action) {
  console.log('Reducer - Action:', action.type, 'Payload:', action.payload);
  
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    
    case 'SET_PRODUCERS':
      return { ...state, producers: action.payload };
    
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    
    case 'SET_FILTERS':
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload } 
      };
    
    case 'CLEAR_FILTERS':
      return { 
        ...state, 
        filters: {
          category: '',
          maxPrice: '',
          location: ''
        }
      };
    
    case 'ADD_PRODUCT':
      console.log('ADD_PRODUCT - Produto atual:', action.payload);
      console.log('ADD_PRODUCT - Produtos antes:', state.products.length);
      const newProducts = [...state.products, action.payload];
      console.log('ADD_PRODUCT - Produtos depois:', newProducts.length);
      return { 
        ...state, 
        products: newProducts 
      };
    
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.payload.id ? { ...p, ...action.payload.updates } : p
        )
      };
    
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload)
      };
    
    case 'ADD_PRODUCER':
      return { ...state, producers: [...state.producers, action.payload] };
    
    case 'ADD_TO_FAVORITES':
      return {
        ...state,
        favorites: state.favorites.some(fav => fav.id === action.payload.id)
          ? state.favorites
          : [...state.favorites, action.payload]
      };
    
    case 'REMOVE_FROM_FAVORITES':
      return {
        ...state,
        favorites: state.favorites.filter(fav => fav.id !== action.payload)
      };
    
    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload };
    
    default:
      return state;
  }
}

// Provedor do contexto
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [storedFavorites, setStoredFavorites] = useLocalStorage('favorites', []);
  const [storedUser, setStoredUser] = useLocalStorage('currentUser', null);

  // Carregar dados iniciais
  useEffect(() => {
    console.log('Carregando dados iniciais...');
    dispatch({ type: 'SET_PRODUCTS', payload: initialProducts });
    dispatch({ type: 'SET_PRODUCERS', payload: initialProducers });
  }, []);

  // Sincronizar favoritos com localStorage
  useEffect(() => {
    console.log('Sincronizando favoritos:', storedFavorites);
    dispatch({ type: 'SET_FAVORITES', payload: storedFavorites });
  }, [storedFavorites]);

  // Sincronizar usuário com localStorage
  useEffect(() => {
    console.log('Sincronizando usuário:', storedUser);
    dispatch({ type: 'SET_CURRENT_USER', payload: storedUser });
  }, [storedUser]);

  // Ações
  const setSearchTerm = (term) => {
    console.log('setSearchTerm:', term);
    dispatch({ type: 'SET_SEARCH_TERM', payload: term });
  };

  const setFilters = (filters) => {
    console.log('setFilters:', filters);
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const clearFilters = () => {
    console.log('clearFilters');
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  const login = (email, password) => {
    console.log('Login attempt:', email);
    const producer = state.producers.find(p => 
      p.email === email && p.password === password
    );
    
    if (producer) {
      const user = { 
        id: producer.id, 
        name: producer.name, 
        email: producer.email,
        type: 'producer'
      };
      console.log('Login successful:', user);
      dispatch({ type: 'SET_CURRENT_USER', payload: user });
      setStoredUser(user);
      return { success: true };
    }
    
    console.log('Login failed: invalid credentials');
    return { success: false, error: 'Email ou senha incorretos' };
  };

  const logout = () => {
    console.log('Logout');
    dispatch({ type: 'SET_CURRENT_USER', payload: null });
    setStoredUser(null);
  };

  const registerProducer = (producerData) => {
    console.log('registerProducer:', producerData);
    const newProducer = {
      id: Date.now().toString(),
      ...producerData,
      image: producerData.image || defaultImages.producer,
      categories: []
    };
    
    dispatch({ type: 'ADD_PRODUCER', payload: newProducer });
    
    // Auto login após cadastro
    const user = {
      id: newProducer.id,
      name: newProducer.name,
      email: newProducer.email,
      type: 'producer'
    };
    dispatch({ type: 'SET_CURRENT_USER', payload: user });
    setStoredUser(user);
    
    return { success: true };
  };

  const addProduct = (productData) => {
    console.log('addProduct - Dados recebidos:', productData);
    
    if (!state.currentUser) {
      console.error('addProduct - Erro: Usuário não logado');
      throw new Error('Usuário não logado');
    }

    const newProduct = {
      id: Date.now().toString(),
      ...productData,
      price: parseFloat(productData.price),
      image: productData.image || defaultImages.product,
      producerId: state.currentUser.id,
      available: true,
      featured: false,
      quantity: 100, // Quantidade padrão
      createdAt: new Date()
    };

    console.log('addProduct - Novo produto criado:', newProduct);
    dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
    return newProduct;
  };

  const updateProduct = (productId, updates) => {
    console.log('updateProduct:', productId, updates);
    dispatch({ 
      type: 'UPDATE_PRODUCT', 
      payload: { id: productId, updates } 
    });
  };

  const deleteProduct = (productId) => {
    console.log('deleteProduct:', productId);
    dispatch({ type: 'DELETE_PRODUCT', payload: productId });
  };

  const addProducer = (producerData) => {
    console.log('addProducer:', producerData);
    const newProducer = {
      id: Date.now().toString(),
      ...producerData,
      image: producerData.image || defaultImages.producer
    };
    dispatch({ type: 'ADD_PRODUCER', payload: newProducer });
    return newProducer;
  };

  const addToFavorites = (product) => {
    console.log('addToFavorites:', product.id);
    dispatch({ type: 'ADD_TO_FAVORITES', payload: product });
    setStoredFavorites(prev => 
      prev.some(fav => fav.id === product.id) 
        ? prev 
        : [...prev, product]
    );
  };

  const removeFromFavorites = (productId) => {
    console.log('removeFromFavorites:', productId);
    dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: productId });
    setStoredFavorites(prev => prev.filter(fav => fav.id !== productId));
  };

  const getProducerById = (producerId) => {
    const producer = state.producers.find(p => p.id === producerId);
    console.log('getProducerById:', producerId, 'found:', !!producer);
    return producer;
  };

  const handleWhatsAppClick = (product, producer) => {
    console.log('handleWhatsAppClick:', product.name, producer.name);
    const message = `Olá ${producer.name}! Gostaria de saber mais sobre o produto: ${product.name} - ${product.description}`;
    const whatsappUrl = `https://wa.me/${producer.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Produtos em destaque (filtrados)
  const featuredProducts = state.products.filter(product => 
    product.featured && product.available
  );

  // Produtos do usuário logado
  const myProducts = state.currentUser 
    ? state.products.filter(p => p.producerId === state.currentUser.id)
    : [];

  // Produtos filtrados
  const filteredProducts = state.products.filter(product => {
    const matchesSearch = state.searchTerm === '' || 
      product.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(state.searchTerm.toLowerCase()));
    
    const matchesCategory = !state.filters.category || product.category === state.filters.category;
    const matchesPrice = !state.filters.maxPrice || product.price <= parseFloat(state.filters.maxPrice);
    
    const producer = getProducerById(product.producerId);
    const matchesLocation = !state.filters.location || 
      (producer && producer.location.toLowerCase().includes(state.filters.location.toLowerCase()));

    const isAvailable = product.available !== false;

    const matches = matchesSearch && matchesCategory && matchesPrice && matchesLocation && isAvailable;
    
    if (matches) {
      console.log('Produto filtrado:', product.name, {
        matchesSearch, matchesCategory, matchesPrice, matchesLocation, isAvailable
      });
    }

    return matches;
  });

  // Categorias únicas
  const categories = [...new Set(state.products.map(p => p.category).filter(Boolean))];

  console.log('AppContext State:', {
    productsCount: state.products.length,
    producersCount: state.producers.length,
    currentUser: state.currentUser,
    searchTerm: state.searchTerm,
    filters: state.filters,
    favoritesCount: state.favorites.length,
    featuredProductsCount: featuredProducts.length,
    myProductsCount: myProducts.length,
    filteredProductsCount: filteredProducts.length,
    categoriesCount: categories.length
  });

  const value = {
    // Estado
    ...state,
    featuredProducts,
    myProducts,
    filteredProducts,
    categories,
    defaultImages,
    
    // Ações
    setSearchTerm,
    setFilters,
    clearFilters,
    login,
    logout,
    registerProducer,
    addProduct,
    updateProduct,
    deleteProduct,
    addProducer,
    addToFavorites,
    removeFromFavorites,
    getProducerById,
    handleWhatsAppClick
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Hook personalizado para usar o contexto
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
}