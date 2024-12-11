import { Connection } from 'mysql2/promise';
import { Category } from '../../types';

export class CategoryService {
  private db: Connection;

  constructor(db: Connection) {
    this.db = db;
  }

  async getAll(): Promise<Category[]> {
    const [rows] = await this.db.execute('SELECT * FROM categories ORDER BY name');
    return rows as Category[];
  }

  async getById(id: string): Promise<Category | null> {
    const [rows] = await this.db.execute('SELECT * FROM categories WHERE id = ?', [id]);
    const categories = rows as Category[];
    return categories[0] || null;
  }

  async create(category: Omit<Category, 'id'>): Promise<Category> {
    const id = crypto.randomUUID();
    await this.db.execute(
      'INSERT INTO categories (id, name, description) VALUES (?, ?, ?)',
      [id, category.name, category.description]
    );
    return { ...category, id };
  }

  async update(id: string, category: Partial<Category>): Promise<void> {
    const fields = Object.keys(category)
      .map(key => `${key} = ?`)
      .join(', ');
    const values = [...Object.values(category), id];
    
    await this.db.execute(
      `UPDATE categories SET ${fields} WHERE id = ?`,
      values
    );
  }

  async delete(id: string): Promise<void> {
    await this.db.execute('DELETE FROM categories WHERE id = ?', [id]);
  }
}