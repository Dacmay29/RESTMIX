import React, { useState, useEffect } from 'react';
import { Upload, Download, RefreshCw } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { GoogleSheetsService } from '../../services/sheets/sheets';
import { GOOGLE_SHEETS_CONFIG } from '../../services/sheets/config';

export const GoogleSheetSync: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [sheetsService, setSheetsService] = useState<GoogleSheetsService | null>(null);
  const { addProduct, addCategory, addAddon } = useStore();

  useEffect(() => {
    const initializeService = async () => {
      try {
        const service = new GoogleSheetsService(GOOGLE_SHEETS_CONFIG);
        await service.initialize();
        setSheetsService(service);
      } catch (err) {
        setError('Error initializing Google Sheets: ' + (err as Error).message);
      }
    };

    initializeService();
  }, []);

  const handleCreateTemplate = async () => {
    if (!sheetsService) return;

    setIsLoading(true);
    setError(null);
    try {
      const newSpreadsheetId = await sheetsService.createSpreadsheet('Restaurant Menu Template');
      setSpreadsheetId(newSpreadsheetId);
      window.open(`https://docs.google.com/spreadsheets/d/${newSpreadsheetId}`, '_blank');
    } catch (err) {
      setError('Error creating template: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    if (!sheetsService || !spreadsheetId) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await sheetsService.importData(spreadsheetId);
      
      // Import categories first
      data.categories.forEach((category: any) => {
        addCategory(category);
      });

      // Import addons
      data.addons.forEach((addon: any) => {
        addAddon(addon);
      });

      // Import products
      data.products.forEach((product: any) => {
        addProduct(product);
      });

      alert('Datos importados exitosamente');
    } catch (err) {
      setError('Error importing data: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-medium mb-4">Sincronización con Google Sheets</h2>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID de la Hoja de Cálculo
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={spreadsheetId}
                onChange={(e) => setSpreadsheetId(e.target.value)}
                placeholder="Ej: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                className="flex-1 px-3 py-2 border rounded"
              />
              <button
                onClick={handleImport}
                disabled={isLoading || !spreadsheetId || !sheetsService}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Importar
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleCreateTemplate}
              disabled={isLoading || !sheetsService}
              className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Crear Nueva Plantilla
            </button>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Instrucciones:</h3>
          <ol className="list-decimal list-inside text-sm text-gray-500 space-y-2">
            <li>Haz clic en "Crear Nueva Plantilla" para generar una hoja de cálculo en Google Sheets</li>
            <li>La plantilla incluirá hojas para Productos, Categorías y Adicionales</li>
            <li>Llena los datos siguiendo el formato de ejemplo en cada hoja</li>
            <li>Copia el ID de la hoja de cálculo de la URL</li>
            <li>Pega el ID en el campo de arriba y haz clic en "Importar"</li>
          </ol>
        </div>
      </div>
    </div>
  );
};