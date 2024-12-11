import React from 'react';
import { ProductSize } from '../../../types';

interface SizeSelectorProps {
  sizes: ProductSize[];
  selectedSize: string;
  onSizeSelect: (sizeId: string) => void;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  selectedSize,
  onSizeSelect,
}) => {
  if (!sizes || sizes.length === 0) return null;

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tamaño
      </label>
      <div className="grid grid-cols-3 gap-2">
        {sizes.map((size) => (
          <button
            key={size.id}
            type="button"
            onClick={() => onSizeSelect(size.id)}
            className={`px-3 py-2 text-sm rounded-md transition-colors ${
              selectedSize === size.id
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="flex flex-col items-center">
              <span>{size.name}</span>
              <span className="text-xs mt-1">${size.price.toFixed(2)}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};