import { SheetTemplate, SheetColumn } from './types';
import { TEMPLATES } from './templates';

export class TemplateGenerator {
  private createHeaderRow(columns: SheetColumn[]): string[] {
    return columns.map(col => col.header);
  }

  private createDescriptionRow(columns: SheetColumn[]): string[] {
    return columns.map(col => col.description);
  }

  private createExampleRow(columns: SheetColumn[]): string[] {
    return columns.map(col => col.example || '');
  }

  private createValidationRules(columns: SheetColumn[]): object[] {
    return columns.map(col => ({
      condition: {
        type: col.required ? 'NOT_BLANK' : 'ANY_VALUE',
        values: [],
      },
      showCustomUi: true,
      strict: true,
    }));
  }

  async generateTemplate(spreadsheetId: string): Promise<void> {
    const sheets = gapi.client.sheets;
    
    // Create sheets for each template
    for (const [key, template] of Object.entries(TEMPLATES)) {
      const headerRow = this.createHeaderRow(template.columns);
      const descriptionRow = this.createDescriptionRow(template.columns);
      const exampleRow = this.createExampleRow(template.columns);
      
      // Add sheet
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: template.name,
                  gridProperties: {
                    rowCount: 1000,
                    columnCount: template.columns.length,
                  },
                },
              },
            },
          ],
        },
      });

      // Add data
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId,
        requestBody: {
          valueInputOption: 'RAW',
          data: [
            {
              range: `${template.name}!A1:${String.fromCharCode(65 + template.columns.length - 1)}1`,
              values: [headerRow],
            },
            {
              range: `${template.name}!A2:${String.fromCharCode(65 + template.columns.length - 1)}2`,
              values: [descriptionRow],
            },
            {
              range: `${template.name}!A3:${String.fromCharCode(65 + template.columns.length - 1)}3`,
              values: [exampleRow],
            },
          ],
        },
      });

      // Add validation rules
      const rules = this.createValidationRules(template.columns);
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: template.columns.map((col, index) => ({
            setDataValidation: {
              range: {
                sheetId: 0,
                startRowIndex: 3,
                endRowIndex: 1000,
                startColumnIndex: index,
                endColumnIndex: index + 1,
              },
              rule: rules[index],
            },
          })),
        },
      });

      // Format header
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId: 0,
                  startRowIndex: 0,
                  endRowIndex: 1,
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 },
                    textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
                  },
                },
                fields: 'userEnteredFormat(backgroundColor,textFormat)',
              },
            },
          ],
        },
      });
    }
  }
}