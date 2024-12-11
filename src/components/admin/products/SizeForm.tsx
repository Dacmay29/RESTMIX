import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { ProductSize } from '../../../types';

interface SizeFormProps {
  sizes: ProductSize[];
  defaultSize: string;
  onAddSize: (size: ProductSize) => void;
  onRemoveSize: (sizeId: string) => void;
  onDefaultChange: (sizeId: string) => void;
}

export const SizeForm: React.FC<SizeFormProps> = ({
  sizes,
  defaultSize,
  onAddSize,
  onRemoveSize,
  onDefaultChange,
}) => {
  const [newSize, setNewSize] = useState<Omit<ProductSize, 'id'>>({
    name: '',
    price: 0,
  });

  const handleAddSize = () => {
    if (newSize.name && newSize.price >= 0) {
      const size = { ...newSize, id: crypto.randomUUID() };
      onAddSize(size);
      setNewSize({ name: '', price: 0 });
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tamaños Disponibles
      </label>
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Nombre del tamaño"
              value={newSize.name}
              onChange={(e) => setNewSize(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="flex-1">
            <input
              type="number"
              placeholder="Precio"
              value={newSize.price}
              onChange={(e) => setNewSize(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border rounded"
              step="0.01"
              min="0"
            />
          </div>
          <button
            type="button"
            onClick={handleAddSize}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Agregar
          </button>
        </div>

        <div className="space-y-2">
          {sizes.map((size) => (
            <div key={size.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  name="defaultSize"
                  checked={defaultSize === size.id}
                  onChange={() => onDefaultChange(size.id)}
                />
                <span>{size.name}</span>
                <span className="text-gray-600">${size.price.toFixed(2)}</span>
              </div>
              <button
                type="button"
                onClick={() => onRemoveSize(size.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};