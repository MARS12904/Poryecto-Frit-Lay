import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../data/products';
import { useStock } from './StockContext';

interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number; // Precio unitario (mayorista o regular)
  subtotal: number; // Cantidad * precio unitario
}

interface DeliverySchedule {
  id: string;
  date: string;
  timeSlot: string;
  address: string;
  notes?: string;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  wholesaleTotal: number; // Total con precios mayoristas
  regularTotal: number; // Total con precios regulares
  isWholesaleMode: boolean; // Modo mayorista activo
  deliverySchedule?: DeliverySchedule;
  
  // Funciones básicas del carrito
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  
  // Funciones específicas para comerciantes
  toggleWholesaleMode: () => void;
  setDeliverySchedule: (schedule: DeliverySchedule) => void;
  clearDeliverySchedule: () => void;
  getCartSummary: () => {
    totalItems: number;
    totalPrice: number;
    wholesaleSavings: number;
    deliveryFee: number;
    finalTotal: number;
  };
  validateOrder: () => {
    isValid: boolean;
    errors: string[];
  };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isWholesaleMode, setIsWholesaleMode] = useState(true); // Por defecto modo mayorista
  const [deliverySchedule, setDeliveryScheduleState] = useState<DeliverySchedule | undefined>();
  const { isProductAvailable, reduceStock, increaseStock } = useStock();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.subtotal, 0);
  const wholesaleTotal = items.reduce((sum, item) => sum + (item.product.wholesalePrice * item.quantity), 0);
  const regularTotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    saveCart();
  }, [items, isWholesaleMode, deliverySchedule]);

  const loadCart = async () => {
    try {
      const cartData = await AsyncStorage.getItem('cart');
      const wholesaleData = await AsyncStorage.getItem('wholesaleMode');
      const deliveryData = await AsyncStorage.getItem('deliverySchedule');
      
      if (cartData) {
        setItems(JSON.parse(cartData));
      }
      if (wholesaleData) {
        setIsWholesaleMode(JSON.parse(wholesaleData));
      }
      if (deliveryData) {
        setDeliveryScheduleState(JSON.parse(deliveryData));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(items));
      await AsyncStorage.setItem('wholesaleMode', JSON.stringify(isWholesaleMode));
      if (deliverySchedule) {
        await AsyncStorage.setItem('deliverySchedule', JSON.stringify(deliverySchedule));
      }
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = async (product: Product, quantity: number = 1) => {
    // Validar cantidad mínima para comerciantes
    if (isWholesaleMode && quantity < product.minOrderQuantity) {
      quantity = product.minOrderQuantity;
    }

    // Validar cantidad máxima
    if (quantity > product.maxOrderQuantity) {
      quantity = product.maxOrderQuantity;
    }

    const existingItem = items.find(item => item.product.id === product.id);
    const unitPrice = isWholesaleMode ? product.wholesalePrice : product.price;

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      const finalQuantity = Math.min(newQuantity, product.maxOrderQuantity);
      const delta = finalQuantity - existingItem.quantity;
      if (delta > 0) {
        if (!isProductAvailable(product.id, delta)) {
          return; // sin cambios si no hay stock
        }
        await reduceStock(product.id, delta);
      }
      setItems(prevItems => prevItems.map(item =>
        item.product.id === product.id
          ? {
              ...item,
              quantity: finalQuantity,
              unitPrice,
              subtotal: finalQuantity * unitPrice
            }
          : item
      ));
    } else {
      if (!isProductAvailable(product.id, quantity)) {
        return; // no agregar si no hay stock
      }
      await reduceStock(product.id, quantity);
      setItems(prevItems => [...prevItems, {
        product,
        quantity,
        unitPrice,
        subtotal: quantity * unitPrice
      }]);
    }
  };

  const removeFromCart = async (productId: string) => {
    const item = items.find(i => i.product.id === productId);
    if (item) {
      await increaseStock(productId, item.quantity);
    }
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    const item = items.find(i => i.product.id === productId);
    if (!item) return;
    const clamped = Math.min(quantity, item.product.maxOrderQuantity);
    const delta = clamped - item.quantity;
    if (delta > 0) {
      if (!isProductAvailable(productId, delta)) {
        return; // sin cambios
      }
      await reduceStock(productId, delta);
    } else if (delta < 0) {
      await increaseStock(productId, Math.abs(delta));
    }
    const unitPrice = isWholesaleMode ? item.product.wholesalePrice : item.product.price;
    setItems(prevItems => prevItems.map(it => it.product.id === productId ? {
      ...it,
      quantity: clamped,
      unitPrice,
      subtotal: clamped * unitPrice
    } : it));
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (productId: string) => {
    return items.some(item => item.product.id === productId);
  };

  const toggleWholesaleMode = () => {
    const newMode = !isWholesaleMode;
    setIsWholesaleMode(newMode);
    
    // Actualizar precios en el carrito
    setItems(prevItems =>
      prevItems.map(item => {
        const unitPrice = newMode ? item.product.wholesalePrice : item.product.price;
        return {
          ...item,
          unitPrice,
          subtotal: item.quantity * unitPrice
        };
      })
    );
  };

  const setDeliverySchedule = (schedule: DeliverySchedule) => {
    setDeliveryScheduleState(schedule);
  };

  const clearDeliverySchedule = () => {
    setDeliveryScheduleState(undefined);
  };

  const getCartSummary = () => {
    const deliveryFee = deliverySchedule ? 15.00 : 0; // Tarifa de envío programado
    const wholesaleSavings = regularTotal - wholesaleTotal;
    const finalTotal = totalPrice + deliveryFee;

    return {
      totalItems,
      totalPrice,
      wholesaleSavings,
      deliveryFee,
      finalTotal
    };
  };

  const validateOrder = () => {
    const errors: string[] = [];

    if (items.length === 0) {
      errors.push('El carrito está vacío');
    }

    items.forEach(item => {
      if (item.quantity < item.product.minOrderQuantity) {
        errors.push(`${item.product.name}: cantidad mínima es ${item.product.minOrderQuantity}`);
      }
      if (item.quantity > item.product.maxOrderQuantity) {
        errors.push(`${item.product.name}: cantidad máxima es ${item.product.maxOrderQuantity}`);
      }
      if (!item.product.isAvailable) {
        errors.push(`${item.product.name}: producto no disponible`);
      }
    });

    if (isWholesaleMode && !deliverySchedule) {
      errors.push('Debe programar una entrega para pedidos mayoristas');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const value: CartContextType = {
    items,
    totalItems,
    totalPrice,
    wholesaleTotal,
    regularTotal,
    isWholesaleMode,
    deliverySchedule,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    toggleWholesaleMode,
    setDeliverySchedule,
    clearDeliverySchedule,
    getCartSummary,
    validateOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
