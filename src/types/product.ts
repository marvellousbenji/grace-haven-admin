export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  material: string;
  category: string;
  images: string[];
  sizes: string[];
  colors: string[];
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Booking {
  id: string;
  productId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}