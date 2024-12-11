import React from 'react';
import { Pencil, Trash2, Image as ImageIcon } from 'lucide-react';
import { Product } from '../../../types';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid gap-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover rounded"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-gray-400" />
              </div>
            )}
            <div>
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.description}</p>
              {product.sizes && product.sizes.length > 0 ? (
                <div className="text-sm font-medium mt-1">
                  {product.sizes.map(size => (
                    <span key={size.id} className="mr-3">
                      {size.name}: ${size.price.toFixed(2)}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm font-medium mt-1">${product.price.toFixed(2)}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(product)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="p-2 hover:bg-gray-100 rounded text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};