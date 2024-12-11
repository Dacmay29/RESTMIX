import React, { useState } from 'react';
import { Product, Category, Addon, ProductSize } from '../../../types';

interface ProductFormProps {
  initialProduct?: Product;
  categories: Category[];
  addons: Addon[];
  onSubmit: (product: Omit<Product, 'id'>) => void;
  onCancel: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialProduct,
  categories,
  addons,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: initialProduct?.name || '',
    description: initialProduct?.description || '',
    price: initialProduct?.price || 0,
    category: initialProduct?.category || categories[0]?.id || '',
    addons: initialProduct?.addons || [],
    image: initialProduct?.image || '',
    preparationTime: initialProduct?.preparationTime || 0,
    spicyLevel: initialProduct?.spicyLevel || 0,
    sizes: initialProduct?.sizes || [],
    defaultSize: initialProduct?.defaultSize || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSizes = Array.from(e.target.selectedOptions).map(option => ({
      id: option.value,
      name: option.getAttribute('data-name') || '',
      price: parseFloat(option.getAttribute('data-price') || '0'),
    }));

    setFormData(prev => ({
      ...prev,
      sizes: selectedSizes,
      defaultSize: selectedSizes[0]?.id || '',
    }));
  };

  const handleSizePriceChange = (sizeId: string, price: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.map(size =>
        size.id === sizeId ? { ...size, price } : size
      ),
    }));
  };

  const availableSizes: Array<{ id: string; name: string }> = [
    { id: 'small', name: 'Pequeña' },
    { id: 'medium', name: 'Mediana' },
    { id: 'large', name: 'Grande' },
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio Base
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
            className="w-full px-3 py-2 border rounded"
            step="0.01"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border rounded"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-3 py-2 border rounded"
            required
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tamaños Disponibles
          </label>
          <select
            multiple
            value={formData.sizes.map(size => size.id)}
            onChange={handleSizeChange}
            className="w-full px-3 py-2 border rounded"
            size={4}
          >
            {availableSizes.map((size) => (
              <option
                key={size.id}
                value={size.id}
                data-name={size.name}
                data-price={formData.price}
              >
                {size.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Mantén presionado Ctrl/Cmd para seleccionar múltiples tamaños
          </p>
        </div>
      </div>

      {formData.sizes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Precios por Tamaño</h3>
          <div className="grid gap-3">
            {formData.sizes.map((size) => (
              <div key={size.id} className="flex items-center gap-4">
                <span className="text-sm font-medium w-24">{size.name}</span>
                <input
                  type="number"
                  value={size.price}
                  onChange={(e) => handleSizePriceChange(size.id, parseFloat(e.target.value) || 0)}
                  className="w-32 px-3 py-2 border rounded"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tamaño por Defecto
          </label>
          <select
            value={formData.defaultSize}
            onChange={(e) => setFormData(prev => ({ ...prev, defaultSize: e.target.value }))}
            className="w-full px-3 py-2 border rounded"
            disabled={formData.sizes.length === 0}
          >
            <option value="">Seleccionar tamaño por defecto</option>
            {formData.sizes.map((size) => (
              <option key={size.id} value={size.id}>
                {size.name} - ${size.price.toFixed(2)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imagen URL
          </label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
            className="w-full px-3 py-2 border rounded"
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tiempo de Preparación (min)
          </label>
          <input
            type="number"
            value={formData.preparationTime}
            onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: parseInt(e.target.value) || 0 }))}
            className="w-full px-3 py-2 border rounded"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nivel de Picante (0-3)
          </label>
          <input
            type="number"
            value={formData.spicyLevel}
            onChange={(e) => setFormData(prev => ({ ...prev, spicyLevel: parseInt(e.target.value) || 0 }))}
            className="w-full px-3 py-2 border rounded"
            min="0"
            max="3"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Adicionales Disponibles
        </label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {addons.map((addon) => (
            <label key={addon.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.addons.some(a => a.id === addon.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData(prev => ({
                      ...prev,
                      addons: [...prev.addons, addon],
                    }));
                  } else {
                    setFormData(prev => ({
                      ...prev,
                      addons: prev.addons.filter(a => a.id !== addon.id),
                    }));
                  }
                }}
              />
              <span className="text-sm">{addon.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          {initialProduct ? 'Actualizar' : 'Crear'} Producto
        </button>
      </div>
    </form>
  );
};