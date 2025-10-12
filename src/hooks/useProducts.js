// hooks/useProducts.js
import { useMemo } from 'react';
import { useApp } from '../context/AppContext';

export const useProducts = () => {
  const { products, producers, filters, searchTerm } = useApp();

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !filters.category || product.category === filters.category;
      const matchesPrice = !filters.maxPrice || product.price <= parseFloat(filters.maxPrice);
      
      const producer = producers.find(p => p.id === product.producerId);
      const matchesLocation = !filters.location || 
        (producer && producer.location.toLowerCase().includes(filters.location.toLowerCase()));

      return matchesSearch && matchesCategory && matchesPrice && matchesLocation && product.available;
    });
  }, [products, producers, filters, searchTerm]);

  const categories = useMemo(() => {
    return [...new Set(products.map(p => p.category).filter(Boolean))];
  }, [products]);

  return {
    products: filteredProducts,
    categories,
    totalProducts: products.length,
    filteredCount: filteredProducts.length
  };
};