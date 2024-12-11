import { GoogleSheetsAuth } from './auth';
import { TemplateGenerator } from './template-generator';
import { DataProcessor } from './data-processor';
import { SheetValidator } from './validation';
import { GoogleSheetsConfig, ImportResult, ValidationResult } from './types';

export class GoogleSheetsService {
  private auth: GoogleSheetsAuth;
  private templateGenerator: TemplateGenerator;
  private dataProcessor: DataProcessor;
  private validator: SheetValidator;
  private config: GoogleSheetsConfig;

  constructor(config: GoogleSheetsConfig) {
    this.config = config;
    this.auth = new GoogleSheetsAuth(config);
    this.templateGenerator = new TemplateGenerator();
    this.dataProcessor = new DataProcessor();
    this.validator = new SheetValidator();
  }

  // ... (keep existing initialize and createTemplate methods)

  async validateSpreadsheet(spreadsheetId: string = this.config.spreadsheetId!): Promise<ValidationResult> {
    await this.auth.getAccessToken();
    return this.validator.validateSpreadsheet(spreadsheetId);
  }

  async importData(spreadsheetId: string = this.config.spreadsheetId!): Promise<ImportResult> {
    // Validate before importing
    const validation = await this.validateSpreadsheet(spreadsheetId);
    if (!validation.isValid) {
      throw new Error(
        `Invalid spreadsheet data:\n${validation.errors
          .map(e => `- ${e.message}${e.row ? ` (Row ${e.row})` : ''}`)
          .join('\n')}`
      );
    }

    const accessToken = await this.auth.getAccessToken();
    // ... (rest of the import logic)
  }

  // ... (keep existing exportData method)
}

export * from './types';