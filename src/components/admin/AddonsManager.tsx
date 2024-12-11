import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Addon } from '../../types';
import { useStore } from '../../store/useStore';

export const AddonsManager: React.FC = () => {
  const { addons, addAddon, updateAddon, deleteAddon } = useStore();
  const [editingAddon, setEditingAddon] = useState<Addon | null>(null);
  const [showForm, setShowForm] = useState(false);

  const initialAddon: Omit<Addon, 'id'> = {
    name: '',
    price: 0,
    category: 'extra',
  };

  const [formData, setFormData] = useState<typeof initialAddon>(initialAddon);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAddon) {
      updateAddon(editingAddon.id, formData);
    } else {
      addAddon(formData);
    }
    
    setShowForm(false);
    setFormData(initialAddon);
    setEditingAddon(null);
  };

  const handleEdit = (addon: Addon) => {
    setEditingAddon(addon);
    setFormData({
      name: addon.name,
      price: addon.price,
      category: addon.category || 'extra',
    });
    setShowForm(true);
  };

  const handleDelete = (addonId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este adicional?')) {
      deleteAddon(addonId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Adicionales</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingAddon(null);
            setFormData(initialAddon);
          }}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
        >
          <Plus className="h-4 w-4" />
          Nuevo Adicional
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
                Precio
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border rounded"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="extra">Extra</option>
              <option value="sauce">Salsa</option>
              <option value="protein">Proteína</option>
              <option value="topping">Topping</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setFormData(initialAddon);
                setEditingAddon(null);
              }}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              {editingAddon ? 'Actualizar' : 'Crear'} Adicional
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {addons.map((addon) => (
          <div
            key={addon.id}
            className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between"
          >
            <div>
              <h3 className="font-medium">{addon.name}</h3>
              <p className="text-sm text-gray-500">
                ${addon.price.toFixed(2)} - {addon.category}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEdit(addon)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(addon.id)}
                className="p-2 hover:bg-gray-100 rounded text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};