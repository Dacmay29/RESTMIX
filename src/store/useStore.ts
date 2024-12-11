import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product, RestaurantConfig, Category, Addon } from '../types';
import { categories as initialCategories, products as initialProducts, commonAddons as initialAddons } from '../data/menuData';

interface Store {
  // Cart State
  cart: CartItem[];
  addToCart: (product: Product, selectedAddons: string[], selectedSize?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Restaurant Config
  config: RestaurantConfig;
  updateConfig: (config: Partial<RestaurantConfig>) => void;

  // Products Management
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Categories Management
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Addons Management
  addons: Addon[];
  addAddon: (addon: Omit<Addon, 'id'>) => void;
  updateAddon: (id: string, addon: Partial<Addon>) => void;
  deleteAddon: (id: string) => void;
}

const initialConfig: RestaurantConfig = {
  name: 'Mi Restaurante',
  address: 'Calle Principal 123 ciudad Jardin',
  phone: '+573156100334',
  whatsapp: '+573156100334',
  schedule: {
    open: '12:00',
    close: '23:00',
  },
  location: {
    lat: 0,
    lng: 0,
  },
  socialMedia: {
    instagram: '',
    facebook: '',
    twitter: '',
    tiktok: '',
  },
};

export const useStore = create<Store>()(
  persist(
    (set) => ({
      // Initial State
      cart: [],
      config: initialConfig,
      products: initialProducts,
      categories: initialCategories,
      addons: initialAddons,

      // Cart Actions
      addToCart: (product, selectedAddons, selectedSize) =>
        set((state) => {
          const existingItemIndex = state.cart.findIndex(
            (item) =>
              item.product.id === product.id &&
              JSON.stringify(item.selectedAddons.sort()) === JSON.stringify(selectedAddons.sort()) &&
              item.selectedSize === selectedSize
          );

          if (existingItemIndex >= 0) {
            const newCart = [...state.cart];
            newCart[existingItemIndex].quantity += 1;
            return { cart: newCart };
          }

          return {
            cart: [
              ...state.cart,
              { product, quantity: 1, selectedAddons, selectedSize },
            ],
          };
        }),

      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          cart: quantity === 0
            ? state.cart.filter(item => item.product.id !== productId)
            : state.cart.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item
              ),
        })),

      clearCart: () => set({ cart: [] }),

      // Config Actions
      updateConfig: (newConfig) =>
        set((state) => ({
          config: { ...state.config, ...newConfig },
        })),

      // Products Actions
      addProduct: (product) =>
        set((state) => ({
          products: [
            ...state.products,
            { ...product, id: crypto.randomUUID() },
          ],
        })),

      updateProduct: (id, product) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...product } : p
          ),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      // Categories Actions
      addCategory: (category) =>
        set((state) => ({
          categories: [
            ...state.categories,
            { ...category, id: crypto.randomUUID() },
          ],
        })),

      updateCategory: (id, category) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...category } : c
          ),
        })),

      deleteCategory: (id) =>
        set((state) => {
          const { categories, products } = state;
          const updatedCategories = categories.filter((c) => c.id !== id);
          const updatedProducts = products.filter((p) => p.category !== id);
          
          return {
            categories: updatedCategories,
            products: updatedProducts,
          };
        }),

      // Addons Actions
      addAddon: (addon) =>
        set((state) => ({
          addons: [
            ...state.addons,
            { ...addon, id: crypto.randomUUID() },
          ],
        })),

      updateAddon: (id, addon) =>
        set((state) => ({
          addons: state.addons.map((a) =>
            a.id === id ? { ...a, ...addon } : a
          ),
        })),

      deleteAddon: (id) =>
        set((state) => {
          const { addons, products } = state;
          const updatedAddons = addons.filter((a) => a.id !== id);
          const updatedProducts = products.map((product) => ({
            ...product,
            addons: product.addons.filter((a) => a.id !== id),
          }));
          
          return {
            addons: updatedAddons,
            products: updatedProducts,
          };
        }),
    }),
    {
      name: 'restaurant-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
);