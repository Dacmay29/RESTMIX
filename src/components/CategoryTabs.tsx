import React from 'react';
import { useStore } from '../store/useStore';

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  onCategoryChange,
}) => {
  const { categories } = useStore();

  return (
    <div className="border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4">
        <nav className="-mb-px flex space-x-12 justify-center" aria-label="Tabs">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`
                whitespace-nowrap py-6 font-light text-sm tracking-wide uppercase
                ${
                  activeCategory === category.id
                    ? 'border-b-2 border-black text-black'
                    : 'text-gray-500 hover:text-gray-900'
                }
              `}
            >
              {category.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};