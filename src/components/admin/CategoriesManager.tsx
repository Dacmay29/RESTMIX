import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Category } from '../../types';
import { useStore } from '../../store/useStore';
import { CategoryList } from './CategoryList';
import { CategoryForm } from './CategoryForm';
import { Pagination } from '../ui/Pagination';

const ITEMS_PER_PAGE = 5;

export const CategoriesManager: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useStore();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCategories = categories.slice(startIndex, endIndex);

  const handleSubmit = (categoryData: Omit<Category, 'id'>) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData);
    } else {
      addCategory(categoryData);
    }
    
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = (categoryId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      deleteCategory(categoryId);
      
      // Adjust current page if necessary
      const newTotalPages = Math.ceil((categories.length - 1) / ITEMS_PER_PAGE);
      if (currentPage > newTotalPages) {
        setCurrentPage(Math.max(1, newTotalPages));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Categorías</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingCategory(null);
          }}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
        >
          <Plus className="h-4 w-4" />
          Nueva Categoría
        </button>
      </div>

      {showForm && (
        <CategoryForm
          initialCategory={editingCategory || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingCategory(null);
          }}
        />
      )}

      <CategoryList
        categories={currentCategories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};