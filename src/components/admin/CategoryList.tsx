import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Category } from '../../types';

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onEdit,
  onDelete,
}) => {
  if (categories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay categorías disponibles
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {categories.map((category) => (
        <div
          key={category.id}
          className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between"
        >
          <div>
            <h3 className="font-medium">{category.name}</h3>
            <p className="text-sm text-gray-500">{category.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(category)}
              className="p-2 hover:bg-gray-100 rounded"
              title="Editar categoría"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(category.id)}
              className="p-2 hover:bg-gray-100 rounded text-red-500"
              title="Eliminar categoría"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};