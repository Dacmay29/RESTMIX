import { google } from 'googleapis';
import { Product, Category, Addon } from '../types';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SPREADSHEET_ID = ''; // You'll need to replace this with your spreadsheet ID

export class GoogleSheetsService {
  private auth: any;
  private sheets: any;

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      this.auth = await google.auth.getClient({
        scopes: SCOPES,
      });

      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
    } catch (error) {
      console.error('Error initializing Google Sheets:', error);
      throw error;
    }
  }

  async getTemplate(): Promise<string> {
    try {
      const response = await this.sheets.spreadsheets.create({
        requestBody: {
          properties: {
            title: 'Restaurant Menu Template',
          },
          sheets: [
            {
              properties: {
                title: 'Products',
              },
              data: [
                {
                  rowData: [
                    {
                      values: [
                        { userEnteredValue: { stringValue: 'Name' } },
                        { userEnteredValue: { stringValue: 'Description' } },
                        { userEnteredValue: { stringValue: 'Price' } },
                        { userEnteredValue: { stringValue: 'Category' } },
                        { userEnteredValue: { stringValue: 'Image URL' } },
                        { userEnteredValue: { stringValue: 'Preparation Time' } },
                        { userEnteredValue: { stringValue: 'Spicy Level' } },
                        { userEnteredValue: { stringValue: 'Addons' } },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      });

      return response.data.spreadsheetId;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  }

  async importProducts(): Promise<{
    products: Partial<Product>[];
    categories: Partial<Category>[];
    addons: Partial<Addon>[];
  }> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Products!A2:H',
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        throw new Error('No data found in spreadsheet');
      }

      const categories = new Set<string>();
      const addonsMap = new Map<string, Partial<Addon>>();
      const products: Partial<Product>[] = [];

      rows.forEach((row: any[]) => {
        const [name, description, price, category, imageUrl, prepTime, spicyLevel, addonsStr] = row;

        // Collect categories
        if (category) {
          categories.add(category);
        }

        // Process addons
        const productAddons: Partial<Addon>[] = [];
        if (addonsStr) {
          addonsStr.split(',').forEach((addonStr: string) => {
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
          name,
          description,
          price: parseFloat(price) || 0,
          category,
          image: imageUrl || '',
          preparationTime: parseInt(prepTime) || 0,
          spicyLevel: parseInt(spicyLevel) || 0,
          addons: productAddons,
        });
      });

      return {
        products,
        categories: Array.from(categories).map(name => ({ name, description: `Category: ${name}` })),
        addons: Array.from(addonsMap.values()),
      };
    } catch (error) {
      console.error('Error importing products:', error);
      throw error;
    }
  }

  async exportProducts(products: Product[]): Promise<void> {
    try {
      const values = products.map(product => [
        product.name,
        product.description,
        product.price.toString(),
        product.category,
        product.image || '',
        product.preparationTime?.toString() || '0',
        product.spicyLevel?.toString() || '0',
        product.addons
          .map(addon => `${addon.name}:${addon.price}`)
          .join(','),
      ]);

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Products!A2',
        valueInputOption: 'RAW',
        requestBody: {
          values,
        },
      });
    } catch (error) {
      console.error('Error exporting products:', error);
      throw error;
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();