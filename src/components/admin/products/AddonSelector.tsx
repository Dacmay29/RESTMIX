import React from 'react';
import { Addon } from '../../../types';

interface AddonSelectorProps {
  addons: Array<{ id: string; name: string }>;
  selectedAddons: Addon[];
  onChange: (addons: Addon[]) => void;
}

export const AddonSelector: React.FC<AddonSelectorProps> = ({
  addons,
  selectedAddons,
  onChange,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Adicionales Disponibles
      </label>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {addons.map((addon) => (
          <label key={addon.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedAddons.some(a => a.id === addon.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  onChange([...selectedAddons, addon as Addon]);
                } else {
                  onChange(selectedAddons.filter(a => a.id !== addon.id));
                }
              }}
            />
            <span className="text-sm">{addon.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};