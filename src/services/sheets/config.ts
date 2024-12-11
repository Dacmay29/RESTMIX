export const GOOGLE_SHEETS_CONFIG = {
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY || '',
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
};

export const SHEET_NAMES = {
  PRODUCTS: 'Products',
  CATEGORIES: 'Categories',
  ADDONS: 'Addons',
};