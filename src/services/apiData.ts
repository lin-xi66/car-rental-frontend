import { api } from './api';

// Types
export interface Car {
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

export interface Store {
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

// API functions
export const getCars = async (params?: {
  type?: string;
  transmission?: string;
  fuel?: string;
  minPrice?: number;
  maxPrice?: number;
  minSeats?: number;
  search?: string;
  status?: string;
}): Promise<Car[]> => {
  const res = await api.getCars(params);
  return res.data;
};

export const getCar = async (id: string): Promise<Car> => {
  const res = await api.getCar(id);
  return res.data;
};

export const getStores = async (params?: {
  city?: string;
  search?: string;
}): Promise<Store[]> => {
  const res = await api.getStores(params);
  return res.data;
};

export const getStore = async (id: string): Promise<Store> => {
  const res = await api.getStore(id);
  return res.data;
};

export const getCarTypes = async (): Promise<string[]> => {
  const res = await api.getCarTypes();
  return res.data;
};

export const getCarBrands = async (): Promise<string[]> => {
  const res = await api.getCarBrands();
  return res.data;
};
