import Papa from 'papaparse';
import { Product, Category, Addon } from '../types';

export class CSVService {
  static generateTemplate(): string {
    const headers = [
      'Name',
      'Description',
      'Price',
      'Category',
      'Image URL',
      'Preparation Time',
      'Spicy Level',
      'Sizes',
      'Default Size',
      'Addons',
    ];

    return Papa.unparse([headers]);
  }

  static async parseCSV(file: File): Promise<{
    products: Partial<Product>[];
    categories: Partial<Category>[];
    addons: Partial<Addon>[];
  }> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          try {
            const categories = new Set<string>();
            const addonsMap = new Map<string, Partial<Addon>>();
            const products: Partial<Product>[] = [];

            results.data.forEach((row: any) => {
              if (!row.Name) return; // Skip empty rows

              // Collect categories
              if (row.Category) {
                categories.add(row.Category);
              }

              // Process sizes
              const sizes = row.Sizes ? row.Sizes.split(',').map((sizeStr: string) => {
                const [name, price] = sizeStr.split(':').map(s => s.trim());
                return {
                  id: crypto.randomUUID(),
                  name,
                  price: parseFloat(price) || 0,
                };
              }) : [];

              // Process addons
              const productAddons: Partial<Addon>[] = [];
              if (row.Addons) {
                row.Addons.split(',').forEach((addonStr: string) => {
                  const [addonName, addonPrice] = addonStr.split(':').map(s => s.trim());
                  if (addonName) {
                    const addon: Partial<Addon> = {
                      name: addonName,
                      price: parseFloat(addonPrice) || 0,
                      category: 'extra',
                    };
                    addonsMap.set(addonName, addon);
                    productAddons.push(addon);
                  }
                });
              }

              // Create product
              products.push({
                name: row.Name,
                description: row.Description,
                price: parseFloat(row.Price) || 0,
                category: row.Category,
                image: row['Image URL'] || '',
                preparationTime: parseInt(row['Preparation Time']) || 0,
                spicyLevel: parseInt(row['Spicy Level']) || 0,
                sizes,
                defaultSize: row['Default Size'] || '',
                addons: productAddons,
              });
            });

            resolve({
              products,
              categories: Array.from(categories).map(name => ({
                name,
                description: `Category: ${name}`,
              })),
              addons: Array.from(addonsMap.values()),
            });
          } catch (error) {
            reject(error);
          }
        },
        error: (error) => reject(error),
      });
    });
  }

  static exportToCSV(products: Product[]): string {
    const data = products.map(product => ({
      'Name': product.name,
      'Description': product.description,
      'Price': product.price,
      'Category': product.category,
      'Image URL': product.image || '',
      'Preparation Time': product.preparationTime || 0,
      'Spicy Level': product.spicyLevel || 0,
      'Sizes': product.sizes?.map(size => `${size.name}:${size.price}`).join(',') || '',
      'Default Size': product.defaultSize || '',
      'Addons': product.addons
        .map(addon => `${addon.name}:${addon.price}`)
        .join(','),
    }));

    return Papa.unparse(data);
  }
}