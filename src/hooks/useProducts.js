import { useMemo } from 'react';
import { useApp } from '../context/AppContext';

export const useProducts = () => {
  const { products, producers, filters, searchTerm } = useApp();

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Filtro por busca
      const matchesSearch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filtro por categoria
      const matchesCategory = !filters.category || product.category === filters.category;
      
      // Filtro por preço
      const matchesPrice = !filters.maxPrice || product.price <= parseFloat(filters.maxPrice);
      
      // Filtro por localização
      const producer = producers.find(p => p.id === product.producerId);
      const matchesLocation = !filters.location || 
        (producer && producer.location.toLowerCase().includes(filters.location.toLowerCase()));

      // Produto deve estar disponível
      const isAvailable = product.available !== false;

      return matchesSearch && matchesCategory && matchesPrice && matchesLocation && isAvailable;
    });

    console.log('Produtos filtrados:', filtered.length);
    console.log('Filtros ativos:', filters);
    console.log('Termo de busca:', searchTerm);

    return filtered;
  }, [products, producers, filters, searchTerm]);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
    console.log('Categorias disponíveis:', uniqueCategories);
    return uniqueCategories;
  }, [products]);

  return {
    products: filteredProducts,
    categories,
    totalProducts: products.length,
    filteredCount: filteredProducts.length
  };
};