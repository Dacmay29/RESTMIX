import { ImportResult } from './types';

export class DataProcessor {
  processImportedData(data: any[][]): ImportResult {
    const [headers, ...rows] = data;
    const headerMap = this.createHeaderMap(headers);

    const products: any[] = [];
    const categories = new Set<string>();
    const addons = new Map<string, any>();
    const sizes = new Map<string, any>();

    rows.forEach(row => {
      const product = this.processRow(row, headerMap);
      if (product) {
        products.push(product);
        
        // Collect categories
        if (product.category) {
          categories.add(product.category);
        }

        // Collect addons
        if (product.addons) {
          product.addons.forEach((addon: any) => {
            addons.set(addon.name, addon);
          });
        }

        // Collect sizes
        if (product.sizes) {
          product.sizes.forEach((size: any) => {
            sizes.set(size.name, size);
          });
        }
      }
    });

    return {
      products,
      categories: Array.from(categories).map(name => ({
        name,
        description: `Category: ${name}`,
      })),
      addons: Array.from(addons.values()),
      sizes: Array.from(sizes.values()),
    };
  }

  private createHeaderMap(headers: string[]): Map<string, number> {
    const map = new Map<string, number>();
    headers.forEach((header, index) => {
      map.set(header.toLowerCase().trim(), index);
    });
    return map;
  }

  private processRow(row: any[], headerMap: Map<string, number>): any | null {
    const getValue = (key: string) => {
      const index = headerMap.get(key.toLowerCase());
      return index !== undefined ? row[index] : null;
    };

    const name = getValue('name');
    if (!name) return null;

    return {
      name,
      description: getValue('description') || '',
      price: parseFloat(getValue('price')) || 0,
      category: getValue('category'),
      image: getValue('image') || '',
      preparationTime: parseInt(getValue('preparation time')) || 0,
      spicyLevel: parseInt(getValue('spicy level')) || 0,
      sizes: this.processSizes(getValue('sizes')),
      defaultSize: getValue('default size'),
      addons: this.processAddons(getValue('addons')),
    };
  }

  private processSizes(sizesStr: string | null): any[] {
    if (!sizesStr) return [];
    return sizesStr.split(',').map(sizeStr => {
      const [name, price] = sizeStr.split(':').map(s => s.trim());
      return {
        id: crypto.randomUUID(),
        name,
        price: parseFloat(price) || 0,
      };
    });
  }

  private processAddons(addonsStr: string | null): any[] {
    if (!addonsStr) return [];
    return addonsStr.split(',').map(addonStr => {
      const [name, price] = addonStr.split(':').map(s => s.trim());
      return {
        id: crypto.randomUUID(),
        name,
        price: parseFloat(price) || 0,
        category: 'extra',
      };
    });
  }
}