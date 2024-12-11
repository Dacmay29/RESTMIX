import { Connection } from 'mysql2/promise';
import { Addon } from '../../types';

export class AddonService {
  private db: Connection;

  constructor(db: Connection) {
    this.db = db;
  }

  async getAll(): Promise<Addon[]> {
    const [rows] = await this.db.execute('SELECT * FROM addons ORDER BY name');
    return rows as Addon[];
  }

  async create(addon: Omit<Addon, 'id'>): Promise<Addon> {
    const id = crypto.randomUUID();
    await this.db.execute(
      'INSERT INTO addons (id, name, price, category) VALUES (?, ?, ?, ?)',
      [id, addon.name, addon.price, addon.category]
    );
    return { ...addon, id };
  }

  async update(id: string, addon: Partial<Addon>): Promise<void> {
    const fields = Object.keys(addon)
      .map(key => `${key} = ?`)
      .join(', ');
    const values = [...Object.values(addon), id];
    
    await this.db.execute(
      `UPDATE addons SET ${fields} WHERE id = ?`,
      values
    );
  }

  async delete(id: string): Promise<void> {
    await this.db.execute('DELETE FROM addons WHERE id = ?', [id]);
  }
}