import { Connection } from 'mysql2/promise';
import { Product, ProductSize } from '../../types';

export class ProductService {
  private db: Connection;

  constructor(db: Connection) {
    this.db = db;
  }

  async getAll(): Promise<Product[]> {
    const [products] = await this.db.execute(`
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.name
    `);

    const enrichedProducts = await Promise.all(
      (products as Product[]).map(async product => {
        const sizes = await this.getProductSizes(product.id);
        const addons = await this.getProductAddons(product.id);
        return { ...product, sizes, addons };
      })
    );

    return enrichedProducts;
  }

  private async getProductSizes(productId: string): Promise<ProductSize[]> {
    const [sizes] = await this.db.execute(
      'SELECT * FROM product_sizes WHERE product_id = ?',
      [productId]
    );
    return sizes as ProductSize[];
  }

  private async getProductAddons(productId: string): Promise<any[]> {
    const [addons] = await this.db.execute(`
      SELECT a.* 
      FROM addons a
      JOIN product_addons pa ON a.id = pa.addon_id
      WHERE pa.product_id = ?
    `, [productId]);
    return addons as any[];
  }

  async create(product: Omit<Product, 'id'>): Promise<Product> {
    const id = crypto.randomUUID();
    
    await this.db.beginTransaction();
    try {
      // Insert product
      await this.db.execute(`
        INSERT INTO products (
          id, name, description, price, category_id, 
          image_url, preparation_time, spicy_level
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        id, product.name, product.description, product.price,
        product.category, product.image, product.preparationTime,
        product.spicyLevel
      ]);

      // Insert sizes
      if (product.sizes?.length) {
        await Promise.all(product.sizes.map(size =>
          this.db.execute(`
            INSERT INTO product_sizes (id, product_id, name, price, is_default)
            VALUES (?, ?, ?, ?, ?)
          `, [
            crypto.randomUUID(), id, size.name, size.price,
            size.id === product.defaultSize
          ])
        ));
      }

      // Insert addons
      if (product.addons?.length) {
        await Promise.all(product.addons.map(addon =>
          this.db.execute(
            'INSERT INTO product_addons (product_id, addon_id) VALUES (?, ?)',
            [id, addon.id]
          )
        ));
      }

      await this.db.commit();
      return { ...product, id };
    } catch (error) {
      await this.db.rollback();
      throw error;
    }
  }

  async update(id: string, product: Partial<Product>): Promise<void> {
    await this.db.beginTransaction();
    try {
      // Update product
      const fields = Object.keys(product)
        .filter(key => !['sizes', 'addons'].includes(key))
        .map(key => `${key} = ?`)
        .join(', ');
      const values = [
        ...Object.entries(product)
          .filter(([key]) => !['sizes', 'addons'].includes(key))
          .map(([, value]) => value),
        id
      ];

      if (fields) {
        await this.db.execute(
          `UPDATE products SET ${fields} WHERE id = ?`,
          values
        );
      }

      // Update sizes
      if (product.sizes) {
        await this.db.execute(
          'DELETE FROM product_sizes WHERE product_id = ?',
          [id]
        );
        await Promise.all(product.sizes.map(size =>
          this.db.execute(`
            INSERT INTO product_sizes (id, product_id, name, price, is_default)
            VALUES (?, ?, ?, ?, ?)
          `, [
            crypto.randomUUID(), id, size.name, size.price,
            size.id === product.defaultSize
          ])
        ));
      }

      // Update addons
      if (product.addons) {
        await this.db.execute(
          'DELETE FROM product_addons WHERE product_id = ?',
          [id]
        );
        await Promise.all(product.addons.map(addon =>
          this.db.execute(
            'INSERT INTO product_addons (product_id, addon_id) VALUES (?, ?)',
            [id, addon.id]
          )
        ));
      }

      await this.db.commit();
    } catch (error) {
      await this.db.rollback();
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    await this.db.execute('DELETE FROM products WHERE id = ?', [id]);
  }
}