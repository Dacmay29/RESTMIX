import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Image as ImageIcon, Upload } from 'lucide-react';

export const Settings: React.FC = () => {
  const { config, updateConfig } = useStore();
  const [logoPreview, setLogoPreview] = useState<string>(config.logo || '');

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogoPreview(base64String);
        updateConfig({ logo: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    updateConfig({
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      phone: formData.get('phone') as string,
      whatsapp: formData.get('whatsapp') as string,
      schedule: {
        open: formData.get('openTime') as string,
        close: formData.get('closeTime') as string,
      },
    });

    alert('Configuración actualizada correctamente');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-light mb-8">Configuración del Restaurante</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Logo Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-medium mb-4">Logo del Restaurante</h2>
          <div className="flex items-center gap-8">
            <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <ImageIcon className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <div>
              <label className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 cursor-pointer">
                <Upload className="h-4 w-4" />
                Subir Logo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-gray-500 mt-2">
                Recomendado: PNG o SVG con fondo transparente
              </p>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <h2 className="text-xl font-medium mb-4">Información Básica</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Restaurante
            </label>
            <input
              type="text"
              name="name"
              defaultValue={config.name}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <input
              type="text"
              name="address"
              defaultValue={config.address}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                name="phone"
                defaultValue={config.phone}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp
              </label>
              <input
                type="tel"
                name="whatsapp"
                defaultValue={config.whatsapp}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora de Apertura
              </label>
              <input
                type="time"
                name="openTime"
                defaultValue={config.schedule.open}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora de Cierre
              </label>
              <input
                type="time"
                name="closeTime"
                defaultValue={config.schedule.close}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};