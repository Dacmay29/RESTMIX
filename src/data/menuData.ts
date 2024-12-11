import { Category, Product, Addon } from '../types';

export const categories: Category[] = [
  {
    id: 'entradas',
    name: 'Entradas',
    description: 'Para comenzar',
  },
  {
    id: 'principales',
    name: 'Principales',
    description: 'Platos destacados',
  },
  {
    id: 'postres',
    name: 'Postres',
    description: 'Final dulce',
  },
  {
    id: 'bebidas',
    name: 'Bebidas',
    description: 'Para acompañar',
  },
];

export const commonAddons: Addon[] = [
  { id: 'extra_queso', name: 'Queso Extra', price: 2.50, category: 'extra' },
  { id: 'guacamole', name: 'Guacamole', price: 3.00, category: 'extra' },
  { id: 'salsa_ajo', name: 'Salsa de Ajo', price: 1.50, category: 'sauce' },
  { id: 'picante_extra', name: 'Picante Extra', price: 1.00, category: 'sauce' },
  { id: 'aceite_oliva', name: 'Aceite de Oliva Extra Virgen', price: 2.00, category: 'extra' },
  { id: 'parmesano', name: 'Parmesano Rallado', price: 2.50, category: 'topping' },
  { id: 'huevo', name: 'Huevo Frito', price: 2.00, category: 'protein' },
  { id: 'bacon', name: 'Bacon Crujiente', price: 3.50, category: 'protein' },
  { id: 'champinones', name: 'Champiñones Salteados', price: 2.50, category: 'topping' },
  { id: 'cebolla_caram', name: 'Cebolla Caramelizada', price: 2.00, category: 'topping' },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Pizza Margherita',
    description: 'Salsa de tomate, mozzarella y albahaca fresca',
    price: 12.99,
    category: 'principales',
    addons: [
      commonAddons.find(a => a.id === 'extra_queso')!,
      commonAddons.find(a => a.id === 'aceite_oliva')!,
      commonAddons.find(a => a.id === 'champinones')!,
    ],
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
    preparationTime: 20,
    sizes: [
      { id: 'small', name: 'Pequeña', price: 12.99 },
      { id: 'medium', name: 'Mediana', price: 16.99 },
      { id: 'large', name: 'Grande', price: 20.99 },
    ],
    defaultSize: 'medium',
  },
  {
    id: '2',
    name: 'Ensalada Verde',
    description: 'Mix de hojas orgánicas, semillas y vinagreta cítrica',
    price: 12.99,
    category: 'entradas',
    addons: [
      commonAddons.find(a => a.id === 'parmesano')!,
      commonAddons.find(a => a.id === 'aceite_oliva')!,
      commonAddons.find(a => a.id === 'champinones')!,
    ],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
  },
  {
    id: '3',
    name: 'Hamburguesa Clásica',
    description: 'Carne de res, lechuga, tomate y queso cheddar',
    price: 14.99,
    category: 'principales',
    addons: [
      commonAddons.find(a => a.id === 'bacon')!,
      commonAddons.find(a => a.id === 'huevo')!,
      commonAddons.find(a => a.id === 'cebolla_caram')!,
      commonAddons.find(a => a.id === 'extra_queso')!,
    ],
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
    preparationTime: 15,
    sizes: [
      { id: 'regular', name: 'Regular', price: 14.99 },
      { id: 'double', name: 'Doble', price: 18.99 },
    ],
    defaultSize: 'regular',
  },
];