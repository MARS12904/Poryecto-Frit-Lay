import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../data/products';
import { showNativeNotification } from '../utils/native-notifications';
import { sendOrderConfirmationEmail } from '../utils/email-service';
import { UserStorage } from '../data/userStorage';

export interface OrderItem {
  id: string;
  name: string;
  brand: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  weight: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  wholesaleTotal: number;
  savings: number;
  items: OrderItem[];
  trackingNumber?: string;
  deliveryDate?: string;
  deliveryAddress?: string;
  deliveryTimeSlot?: string;
  paymentMethod: string;
  isWholesale: boolean;
  notes?: string;
  userId: string;
}

interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  getOrdersByUser: (userId: string) => Order[];
  getOrderById: (orderId: string) => Order | undefined;
  clearOrders: () => Promise<void>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders debe ser usado dentro de OrdersProvider');
  }
  return context;
};

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    saveOrders();
  }, [orders]);

  const loadOrders = async () => {
    try {
      const ordersData = await AsyncStorage.getItem('orders');
      if (ordersData) {
        setOrders(JSON.parse(ordersData));
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const saveOrders = async () => {
    try {
      await AsyncStorage.setItem('orders', JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving orders:', error);
    }
  };

  const generateOrderId = (): string => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const day = String(new Date().getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `FL-${year}-${month}${day}-${random}`;
  };

  const addOrder = async (orderData: Omit<Order, 'id' | 'date' | 'status'>): Promise<Order> => {
    const newOrder: Order = {
      ...orderData,
      id: generateOrderId(),
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
    };

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<void> => {
    const order = orders.find(o => o.id === orderId);
    const previousStatus = order?.status;
    
    // Construir el pedido actualizado antes de actualizar el estado
    const updatedOrder = order ? { ...order, status } : null;
    
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      )
    );
    
    // Enviar notificación cuando cambia el estado (excepto cuando se cancela, ya que se maneja en orders.tsx)
    if (order && status !== 'cancelled' && previousStatus !== status) {
      const statusMessages: Record<Order['status'], { title: string; body: string }> = {
        pending: {
          title: '⏳ Pedido Pendiente',
          body: `Tu pedido ${orderId} está pendiente de confirmación.`
        },
        confirmed: {
          title: '✅ Pedido Confirmado',
          body: `Tu pedido ${orderId} ha sido confirmado. Estamos preparándolo para ti.`
        },
        preparing: {
          title: '👨‍🍳 Pedido en Preparación',
          body: `Tu pedido ${orderId} está siendo preparado. Pronto estará listo para enviar.`
        },
        shipped: {
          title: '🚚 Pedido Enviado',
          body: `¡Tu pedido ${orderId} está en camino!${order.trackingNumber ? ` Número de seguimiento: ${order.trackingNumber}` : ''}`
        },
        delivered: {
          title: '🎉 Pedido Entregado',
          body: `¡Tu pedido ${orderId} ha sido entregado exitosamente! Esperamos que disfrutes tus productos.`
        },
        cancelled: {
          title: '❌ Pedido Cancelado',
          body: `Tu pedido ${orderId} ha sido cancelado.`
        }
      };

      const message = statusMessages[status];
      if (message) {
        showNativeNotification({
          title: message.title,
          body: message.body
        });
      }

      // Enviar correo cuando el pedido se marca como entregado (finalizado)
      if (status === 'delivered' && updatedOrder) {
        try {
          // Obtener información del usuario
          const user = await UserStorage.getUserById(updatedOrder.userId);
          if (user && user.email) {
            await sendOrderConfirmationEmail(
              updatedOrder,
              user.email,
              user.name
            );
            console.log('📧 Correo de finalización de pedido enviado a:', user.email);
          }
        } catch (error) {
          console.error('Error al enviar correo de finalización de pedido:', error);
          // No bloqueamos el proceso si falla el envío del correo
        }
      }
    }
  };

  const getOrdersByUser = (userId: string): Order[] => {
    return orders.filter(order => order.userId === userId);
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  };

  const clearOrders = async (): Promise<void> => {
    setOrders([]);
    await AsyncStorage.removeItem('orders');
  };

  const value: OrdersContextType = {
    orders,
    addOrder,
    updateOrderStatus,
    getOrdersByUser,
    getOrderById,
    clearOrders,
  };

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
};
