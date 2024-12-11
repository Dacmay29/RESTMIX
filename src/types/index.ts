export interface ProductSize {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  addons: Addon[];
  image?: string;
  spicyLevel?: number;
  preparationTime?: number;
  sizes?: ProductSize[];
  defaultSize?: string;
}

export interface Addon {
  id: string;
  name: string;
  price: number;
  category?: 'sauce' | 'extra' | 'protein' | 'topping';
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedAddons: string[];
  selectedSize?: string;
}

export interface SocialMedia {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
}

export interface RestaurantConfig {
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
  schedule: {
    open: string;
    close: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  logo?: string;
  socialMedia?: SocialMedia;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, role: 'admin' | 'user') => Promise<boolean>;
  isLoading: boolean;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}

export type TopicType = 
  | 'premium'
  | 'organico'
  | 'vegano'
  | 'sinGluten'
  | 'sinLactosa'
  | 'picante'
  | 'local'
  | 'vegetariano'
  | 'pescado'
  | 'mariscos'
  | 'keto'
  | 'bajo_en_calorias';