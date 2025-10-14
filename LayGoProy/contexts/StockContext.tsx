import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product, products } from '../data/products';

interface StockContextType {
  stock: Record<string, number>;
  updateStock: (productId: string, quantity: number) => Promise<void>;
  reduceStock: (productId: string, quantity: number) => Promise<boolean>;
  getProductStock: (productId: string) => number;
  isProductAvailable: (productId: string, quantity: number) => boolean;
  initializeStock: () => Promise<void>;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

export const useStock = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error('useStock debe ser usado dentro de StockProvider');
  }
  return context;
};

export const StockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stock, setStock] = useState<Record<string, number>>({});

  useEffect(() => {
    loadStock();
  }, []);

  useEffect(() => {
    saveStock();
  }, [stock]);

  const loadStock = async () => {
    try {
      const stockData = await AsyncStorage.getItem('productStock');
      if (stockData) {
        setStock(JSON.parse(stockData));
      } else {
        // Inicializar stock con los valores por defecto de los productos
        await initializeStock();
      }
    } catch (error) {
      console.error('Error loading stock:', error);
    }
  };

  const saveStock = async () => {
    try {
      await AsyncStorage.setItem('productStock', JSON.stringify(stock));
    } catch (error) {
      console.error('Error saving stock:', error);
    }
  };

  const initializeStock = async (): Promise<void> => {
    const initialStock: Record<string, number> = {};
    products.forEach(product => {
      initialStock[product.id] = product.stock;
    });
    setStock(initialStock);
  };

  const updateStock = async (productId: string, quantity: number): Promise<void> => {
    setStock(prev => ({
      ...prev,
      [productId]: Math.max(0, quantity)
    }));
  };

  const reduceStock = async (productId: string, quantity: number): Promise<boolean> => {
    const currentStock = stock[productId] || 0;
    if (currentStock >= quantity) {
      setStock(prev => ({
        ...prev,
        [productId]: Math.max(0, currentStock - quantity)
      }));
      return true;
    }
    return false;
  };

  const getProductStock = (productId: string): number => {
    return stock[productId] || 0;
  };

  const isProductAvailable = (productId: string, quantity: number): boolean => {
    const currentStock = stock[productId] || 0;
    return currentStock >= quantity;
  };

  const value: StockContextType = {
    stock,
    updateStock,
    reduceStock,
    getProductStock,
    isProductAvailable,
    initializeStock,
  };

  return <StockContext.Provider value={value}>{children}</StockContext.Provider>;
};
