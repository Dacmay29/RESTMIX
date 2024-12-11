import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../store/useStore';
import { ProductForm } from './products/ProductForm';
import { ProductList } from './products/ProductList';

export const ProductsManager: React.FC = () => {
  const { products, categories, addons, addProduct, updateProduct, deleteProduct } = useStore();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (productData: Omit<Product, 'id'>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (productId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      deleteProduct(productId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Productos</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingProduct(null);
          }}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
        >
          <Plus className="h-4 w-4" />
          Nuevo Producto
        </button>
      </div>

      {showForm && (
        <ProductForm
          initialProduct={editingProduct || undefined}
          categories={categories}
          addons={addons}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      <ProductList
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};