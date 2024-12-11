import { SheetTemplate, ValidationResult, ValidationError } from './types';
import { TEMPLATES } from './templates';

export class SheetValidator {
  async validateSpreadsheet(spreadsheetId: string): Promise<ValidationResult> {
    try {
      const sheets = gapi.client.sheets;
      const response = await sheets.spreadsheets.get({ spreadsheetId });
      const spreadsheet = response.result;

      const errors: ValidationError[] = [];
      const warnings: ValidationError[] = [];

      // Validate sheet structure
      for (const [key, template] of Object.entries(TEMPLATES)) {
        const sheet = spreadsheet.sheets?.find(
          (s: any) => s.properties?.title === template.name
        );

        if (!sheet) {
          errors.push({
            sheet: template.name,
            message: `Sheet "${template.name}" is missing`,
            type: 'structure',
          });
          continue;
        }

        // Validate headers
        const headerRange = `${template.name}!A1:${String.fromCharCode(65 + template.columns.length - 1)}1`;
        const headerResponse = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: headerRange,
        });

        const headers = headerResponse.result.values?.[0] || [];
        const expectedHeaders = template.columns.map(col => col.header);

        expectedHeaders.forEach((header, index) => {
          if (headers[index] !== header) {
            errors.push({
              sheet: template.name,
              column: header,
              message: `Missing or incorrect header "${header}"`,
              type: 'header',
            });
          }
        });

        // Validate data
        const dataRange = `${template.name}!A4:${String.fromCharCode(65 + template.columns.length - 1)}`;
        const dataResponse = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: dataRange,
        });

        const rows = dataResponse.result.values || [];
        rows.forEach((row, rowIndex) => {
          template.columns.forEach((col, colIndex) => {
            const value = row[colIndex];
            const rowNum = rowIndex + 4; // Data starts at row 4

            // Check required fields
            if (col.required && !value) {
              errors.push({
                sheet: template.name,
                row: rowNum,
                column: col.header,
                message: `Required field "${col.header}" is empty`,
                type: 'required',
              });
            }

            // Validate data types
            if (value) {
              const validationError = this.validateDataType(col, value);
              if (validationError) {
                errors.push({
                  sheet: template.name,
                  row: rowNum,
                  column: col.header,
                  message: validationError,
                  type: 'type',
                });
              }
            }
          });
        });
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    } catch (error) {
      throw new Error(`Validation failed: ${error.message}`);
    }
  }

  private validateDataType(column: SheetTemplate['columns'][0], value: string): string | null {
    switch (column.type) {
      case 'number':
        if (isNaN(Number(value))) {
          return `Invalid number format for "${column.header}"`;
        }
        break;

      case 'url':
        if (!value.match(/^https?:\/\/.+/)) {
          return `Invalid URL format for "${column.header}"`;
        }
        break;

      case 'size':
        if (value) {
          const sizePattern = /^([^:]+:\d+(\.\d+)?)(,[^:]+:\d+(\.\d+)?)*$/;
          if (!sizePattern.test(value)) {
            return `Invalid size format. Expected "name:price,name:price"`;
          }
        }
        break;

      case 'addon':
        if (value) {
          const addonPattern = /^([^:]+:\d+(\.\d+)?)(,[^:]+:\d+(\.\d+)?)*$/;
          if (!addonPattern.test(value)) {
            return `Invalid addon format. Expected "name:price,name:price"`;
          }
        }
        break;

      case 'category':
        if (!TEMPLATES.categories.columns.some(col => col.key === 'name' && value === col.example)) {
          return `Invalid category. Must match an existing category name`;
        }
        break;
    }

    return null;
  }
}