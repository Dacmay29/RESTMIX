export interface GoogleSheetsConfig {
  apiKey: string;
  clientId: string;
  spreadsheetId?: string;
}

export interface GoogleAPIError extends Error {
  status?: number;
  code?: string;
  details?: string;
}

export interface SheetColumn {
  header: string;
  key: string;
  description: string;
  required?: boolean;
  example?: string;
  type?: 'string' | 'number' | 'url' | 'size' | 'addon' | 'category';
}

export interface SheetTemplate {
  name: string;
  columns: SheetColumn[];
}

export interface ValidationError {
  sheet: string;
  row?: number;
  column?: string;
  message: string;
  type: 'structure' | 'header' | 'required' | 'type';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export interface ImportResult {
  products: any[];
  categories: any[];
  addons: any[];
  sizes: any[];
}