export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  type: CarType;
  seats: number;
  transmission: 'auto' | 'manual';
  fuel: FuelType;
  pricePerDay: number;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  available: boolean;
  features: string[];
  description: string;
  mileage: number;
  color: string;
}

export type CarType = '轿车' | 'SUV' | 'MPV' | '皮卡' | '跑车' | '新能源';
export type FuelType = '汽油' | '柴油' | '电动' | '混合动力';

export interface Order {
  id: string;
  carId: string;
  carName: string;
  carImage: string;
  startDate: string;
  endDate: string;
  days: number;
  pricePerDay: number;
  totalPrice: number;
  status: OrderStatus;
  pickupLocation: string;
  returnLocation: string;
  createdAt: string;
  driverName: string;
  driverPhone: string;
  driverLicense: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'ongoing' | 'completed' | 'cancelled';

export interface FilterOptions {
  type: CarType | 'all';
  priceRange: [number, number];
  seats: number | 'all';
  transmission: 'auto' | 'manual' | 'all';
  fuel: FuelType | 'all';
  sortBy: 'price_asc' | 'price_desc' | 'rating' | 'default';
}
