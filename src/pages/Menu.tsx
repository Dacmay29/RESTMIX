import React, { useState } from 'react';
import { CategoryTabs } from '../components/CategoryTabs';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../store/useStore';

export const Menu: React.FC = () => {
  const { categories, products } = useStore();
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || '');

  const filteredProducts = products.filter(product => 
    product.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="py-16 px-4">
        <h1 className="text-3xl font-light text-center text-gray-900 mb-2 tracking-wide">
          Nuestro Menú
        </h1>
        <p className="text-center text-gray-500 max-w-xl mx-auto text-sm font-light">
          Una selección cuidadosamente elaborada de platos que fusionan sabores tradicionales
          con técnicas contemporáneas
        </p>
      </div>

      {/* Category Tabs */}
      <CategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};