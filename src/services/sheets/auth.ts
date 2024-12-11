import { GoogleSheetsConfig } from './types';

export class GoogleSheetsAuth {
  private config: GoogleSheetsConfig;
  private gapiLoaded = false;
  private gisLoaded = false;

  constructor(config: GoogleSheetsConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    if (!this.gapiLoaded) {
      await this.loadGapiScript();
    }
    if (!this.gisLoaded) {
      await this.loadGisScript();
    }
    await this.initializeGapi();
  }

  private loadGapiScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        this.gapiLoaded = true;
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load Google API script'));
      document.head.appendChild(script);
    });
  }

  private loadGisScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => {
        this.gisLoaded = true;
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load Google Identity Services script'));
      document.head.appendChild(script);
    });
  }

  private async initializeGapi(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      gapi.load('client', async () => {
        try {
          await gapi.client.init({
            apiKey: this.config.apiKey,
            clientId: this.config.clientId,
            scope: 'https://www.googleapis.com/auth/spreadsheets',
            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
          });
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  async authorize(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        gapi.auth2.getAuthInstance().signIn().then(resolve).catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  isSignedIn(): boolean {
    try {
      return gapi.auth2.getAuthInstance().isSignedIn.get();
    } catch {
      return false;
    }
  }

  async signOut(): Promise<void> {
    try {
      await gapi.auth2.getAuthInstance().signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
}