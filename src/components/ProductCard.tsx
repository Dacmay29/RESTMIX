import React, { useState } from 'react';
import { Plus, Clock, Flame } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../store/useStore';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>(product.defaultSize || '');
  const [showAddons, setShowAddons] = useState(false);
  const addToCart = useStore((state) => state.addToCart);

  const handleAddonToggle = (addonId: string) => {
    setSelectedAddons(prev =>
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const getCurrentPrice = () => {
    if (product.sizes && product.sizes.length > 0) {
      const size = product.sizes.find(s => s.id === selectedSize);
      return size ? size.price : product.price;
    }
    return product.price;
  };

  const calculateTotal = () => {
    const basePrice = getCurrentPrice();
    const addonsTotal = selectedAddons.reduce((sum, addonId) => {
      const addon = product.addons.find(a => a.id === addonId);
      return sum + (addon?.price || 0);
    }, 0);
    return (basePrice + addonsTotal).toFixed(2);
  };

  return (
    <div className="bg-white overflow-hidden group transition-all duration-300 hover:shadow-lg rounded-xl">
      <div className="relative aspect-w-16 aspect-h-9 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-t-xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-medium text-gray-900">{product.name}</h3>
          <span className="text-xl font-light text-gray-900">
            ${calculateTotal()}
          </span>
        </div>
        <p className="text-gray-500 text-sm mb-4 font-light">
          {product.description}
        </p>
        
        {/* Size Selector */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tamaño
            </label>
            <div className="grid grid-cols-3 gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => setSelectedSize(size.id)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    selectedSize === size.id
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          {product.preparationTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{product.preparationTime} min</span>
            </div>
          )}
          {product.spicyLevel && (
            <div className="flex items-center gap-1">
              <Flame className="h-4 w-4 text-red-500" />
              <span>{Array(product.spicyLevel).fill('🌶️').join('')}</span>
            </div>
          )}
        </div>

        {/* Addons Section */}
        <div className="mb-4">
          <button
            onClick={() => setShowAddons(!showAddons)}
            className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
          >
            {showAddons ? '- Ocultar adicionales' : '+ Mostrar adicionales'}
          </button>
          
          {showAddons && (
            <div className="mt-3 space-y-4">
              {Object.entries(
                product.addons.reduce((groups, addon) => ({
                  ...groups,
                  [addon.category || 'other']: [
                    ...(groups[addon.category || 'other'] || []),
                    addon,
                  ],
                }), {} as Record<string, typeof product.addons>)
              ).map(([category, addons]) => (
                <div key={category}>
                  <h4 className="text-sm font-medium text-gray-700 mb-2 capitalize">
                    {category}
                  </h4>
                  <div className="space-y-2">
                    {addons.map((addon) => (
                      <label
                        key={addon.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedAddons.includes(addon.id)}
                            onChange={() => handleAddonToggle(addon.id)}
                            className="mr-2"
                          />
                          {addon.name}
                        </div>
                        <span className="text-gray-600">+${addon.price.toFixed(2)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => {
            if (product.sizes?.length && !selectedSize) {
              alert('Por favor selecciona un tamaño');
              return;
            }
            addToCart(product, selectedAddons, selectedSize);
            setSelectedAddons([]);
            setShowAddons(false);
          }}
          className="w-full flex items-center justify-center gap-2 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Agregar
        </button>
      </div>
    </div>
  );
};