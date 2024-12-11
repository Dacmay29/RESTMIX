import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { ProductsManager } from '../components/admin/ProductsManager';
import { CategoriesManager } from '../components/admin/CategoriesManager';
import { AddonsManager } from '../components/admin/AddonsManager';
import { RestaurantSettings } from '../components/admin/RestaurantSettings';
import { GoogleSheetSync } from '../components/admin/GoogleSheetSync';

export const Admin: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-light mb-8">Panel de Administración</h1>
      
      <Tabs defaultValue="products" className="w-full">
        <TabsList>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="categories">Categorías</TabsTrigger>
          <TabsTrigger value="addons">Adicionales</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
          <TabsTrigger value="sync">Sincronización</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <ProductsManager />
        </TabsContent>

        <TabsContent value="categories">
          <CategoriesManager />
        </TabsContent>

        <TabsContent value="addons">
          <AddonsManager />
        </TabsContent>

        <TabsContent value="settings">
          <RestaurantSettings />
        </TabsContent>

        <TabsContent value="sync">
          <GoogleSheetSync />
        </TabsContent>
      </Tabs>
    </div>
  );
};