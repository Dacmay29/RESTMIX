import { SheetTemplate } from './types';

export const TEMPLATES: Record<string, SheetTemplate> = {
  products: {
    name: 'Products',
    columns: [
      {
        header: 'Name',
        key: 'name',
        description: 'Product name',
        required: true,
        type: 'string',
        example: 'Margherita Pizza',
      },
      {
        header: 'Description',
        key: 'description',
        description: 'Product description',
        required: true,
        type: 'string',
        example: 'Classic Italian pizza with tomato and mozzarella',
      },
      {
        header: 'Base Price',
        key: 'price',
        description: 'Base price without sizes',
        required: true,
        type: 'number',
        example: '12.99',
      },
      {
        header: 'Category',
        key: 'category',
        description: 'Product category name',
        required: true,
        type: 'category',
        example: 'Pizzas',
      },
      {
        header: 'Image URL',
        key: 'image',
        description: 'Product image URL',
        type: 'url',
        example: 'https://example.com/image.jpg',
      },
      {
        header: 'Preparation Time',
        key: 'preparationTime',
        description: 'Preparation time in minutes',
        type: 'number',
        example: '20',
      },
      {
        header: 'Spicy Level',
        key: 'spicyLevel',
        description: 'Spicy level (0-3)',
        type: 'number',
        example: '1',
      },
      {
        header: 'Available Sizes',
        key: 'sizes',
        description: 'Size names and prices (name:price,name:price)',
        type: 'size',
        example: 'Small:12.99,Medium:15.99,Large:18.99',
      },
      {
        header: 'Default Size',
        key: 'defaultSize',
        description: 'Default size name',
        type: 'string',
        example: 'Medium',
      },
    ],
  },
  categories: {
    name: 'Categories',
    columns: [
      {
        header: 'Name',
        key: 'name',
        description: 'Category name',
        required: true,
        type: 'string',
        example: 'Pizzas',
      },
      {
        header: 'Description',
        key: 'description',
        description: 'Category description',
        required: true,
        type: 'string',
        example: 'Our selection of handcrafted pizzas',
      },
    ],
  },
  addons: {
    name: 'Addons',
    columns: [
      {
        header: 'Name',
        key: 'name',
        description: 'Addon name',
        required: true,
        type: 'string',
        example: 'Extra Cheese',
      },
      {
        header: 'Price',
        key: 'price',
        description: 'Addon price',
        required: true,
        type: 'number',
        example: '2.50',
      },
      {
        header: 'Category',
        key: 'category',
        description: 'Addon category (sauce, extra, protein, topping)',
        required: true,
        type: 'string',
        example: 'extra',
      },
    ],
  },
};