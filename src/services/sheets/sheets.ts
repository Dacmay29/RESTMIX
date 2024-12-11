import { GoogleSheetsAuth } from './auth';
import { GoogleSheetsConfig } from './types';

export class GoogleSheetsService {
  private auth: GoogleSheetsAuth;
  private initialized = false;

  constructor(config: GoogleSheetsConfig) {
    this.auth = new GoogleSheetsAuth(config);
  }

  async initialize(): Promise<void> {
    if (!this.initialized) {
      await this.auth.initialize();
      this.initialized = true;
    }
  }

  async createSpreadsheet(title: string): Promise<string> {
    if (!this.auth.isSignedIn()) {
      await this.auth.authorize();
    }

    const response = await gapi.client.sheets.spreadsheets.create({
      properties: {
        title,
      },
      sheets: [
        { properties: { title: 'Products' } },
        { properties: { title: 'Categories' } },
        { properties: { title: 'Addons' } },
      ],
    });

    const spreadsheetId = response.result.spreadsheetId;
    await this.setupTemplateSheets(spreadsheetId);
    return spreadsheetId;
  }

  private async setupTemplateSheets(spreadsheetId: string): Promise<void> {
    const templates = {
      Products: [
        ['Name', 'Description', 'Price', 'Category', 'Image URL', 'Preparation Time', 'Spicy Level', 'Sizes', 'Default Size'],
        ['Product name', 'Product description', 'Base price', 'Category name', 'Image URL', 'Minutes', '0-3', 'Small:10.99,Medium:12.99', 'Medium'],
        ['Margherita Pizza', 'Classic Italian pizza', '12.99', 'Pizzas', 'https://example.com/pizza.jpg', '20', '0', 'Small:12.99,Medium:15.99,Large:18.99', 'Medium'],
      ],
      Categories: [
        ['Name', 'Description'],
        ['Category name', 'Category description'],
        ['Pizzas', 'Our delicious pizzas'],
      ],
      Addons: [
        ['Name', 'Price', 'Category'],
        ['Addon name', 'Price', 'extra/sauce/protein/topping'],
        ['Extra Cheese', '2.50', 'extra'],
      ],
    };

    for (const [sheetName, rows] of Object.entries(templates)) {
      await gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A1:Z${rows.length}`,
        valueInputOption: 'RAW',
        resource: { values: rows },
      });
    }
  }

  async importData(spreadsheetId: string): Promise<any> {
    if (!this.auth.isSignedIn()) {
      await this.auth.authorize();
    }

    const sheets = ['Products', 'Categories', 'Addons'];
    const data: Record<string, any[]> = {};

    for (const sheet of sheets) {
      const response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheet}!A4:Z`,
      });

      const rows = response.result.values || [];
      data[sheet.toLowerCase()] = this.processSheetData(sheet, rows);
    }

    return data;
  }

  private processSheetData(sheet: string, rows: any[][]): any[] {
    switch (sheet) {
      case 'Products':
        return rows.map(row => ({
          name: row[0],
          description: row[1],
          price: parseFloat(row[2]) || 0,
          category: row[3],
          image: row[4],
          preparationTime: parseInt(row[5]) || 0,
          spicyLevel: parseInt(row[6]) || 0,
          sizes: this.parseSizes(row[7]),
          defaultSize: row[8],
        }));

      case 'Categories':
        return rows.map(row => ({
          name: row[0],
          description: row[1],
        }));

      case 'Addons':
        return rows.map(row => ({
          name: row[0],
          price: parseFloat(row[1]) || 0,
          category: row[2] || 'extra',
        }));

      default:
        return [];
    }
  }

  private parseSizes(sizesStr: string): any[] {
    if (!sizesStr) return [];
    return sizesStr.split(',').map(size => {
      const [name, price] = size.split(':');
      return {
        id: crypto.randomUUID(),
        name: name.trim(),
        price: parseFloat(price) || 0,
      };
    });
  }
}