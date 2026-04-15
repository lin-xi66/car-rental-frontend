import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';

interface Car {
  id: string;
  name: string;
  brand: string;
  type: string;
  seats: number;
  transmission: string;
  fuel: string;
  price_per_day: number;
  deposit: number;
  description: string;
  features: string[];
  images: string[];
  status: string;
}

interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  district: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
}

export interface Order {
  id: string;
  user_id: string;
  car_id: string;
  pickup_store_id: string;
  return_store_id: string;
  pickup_date: string;
  return_date: string;
  pickup_location: string;
  return_location: string;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  payment_status: 'unpaid' | 'paid';
  payment_method?: string;
  total_amount: number;
  deposit_amount: number;
  contact_name: string;
  contact_phone: string;
  contact_id_card?: string;
  notes?: string;
  created_at: string;
  car?: Car;
  pickup_store?: Store;
  return_store?: Store;
}

interface OrdersContextType {
  orders: Order[];
  isLoading: boolean;
  fetchOrders: () => Promise<void>;
  createOrder: (orderData: Partial<Order>) => Promise<Order>;
  cancelOrder: (orderId: string) => Promise<void>;
  payOrder: (orderId: string, paymentMethod: string) => Promise<void>;
}

export const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setOrders([]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.getOrders();
      setOrders(res.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createOrder = async (orderData: Partial<Order>): Promise<Order> => {
    const res = await api.createOrder(orderData);
    const newOrder = res.data;
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const cancelOrder = async (orderId: string) => {
    await api.cancelOrder(orderId);
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status: 'cancelled' } : order
      )
    );
  };

  const payOrder = async (orderId: string, paymentMethod: string) => {
    await api.payOrder(orderId, paymentMethod);
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, payment_status: 'paid', status: 'confirmed', payment_method: paymentMethod }
          : order
      )
    );
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchOrders();
    }
  }, []);

  return (
    <OrdersContext.Provider
      value={{
        orders,
        isLoading,
        fetchOrders,
        createOrder,
        cancelOrder,
        payOrder
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}
