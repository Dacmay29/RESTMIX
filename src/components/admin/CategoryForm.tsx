import React, { useState, useEffect } from 'react';
import { Category } from '../../types';

interface CategoryFormProps {
  initialCategory?: Category;
  onSubmit: (categoryData: Omit<Category, 'id'>) => void;
  onCancel: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialCategory,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Omit<Category, 'id'>>({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (initialCategory) {
      setFormData({
        name: initialCategory.name,
        description: initialCategory.description,
      });
    }
  }, [initialCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
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
          {initialCategory ? 'Actualizar' : 'Crear'} Categoría
        </button>
      </div>
    </form>
  );
};