import express from 'express';
import cors from 'cors';
import { createConnection } from './db/config';
import { CategoryService } from './services/categoryService';
import { ProductService } from './services/productService';
import { AddonService } from './services/addonService';

const app = express();
app.use(cors());
app.use(express.json());

let db: any;
let categoryService: CategoryService;
let productService: ProductService;
let addonService: AddonService;

// Initialize database connection and services
(async () => {
  try {
    db = await createConnection();
    categoryService = new CategoryService(db);
    productService = new ProductService(db);
    addonService = new AddonService(db);
  } catch (error) {
    console.error('Failed to initialize services:', error);
    process.exit(1);
  }
})();

// Categories endpoints
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await categoryService.getAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const category = await categoryService.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Products endpoints
app.get('/api/products', async (req, res) => {
  try {
    const products = await productService.getAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = await productService.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Addons endpoints
app.get('/api/addons', async (req, res) => {
  try {
    const addons = await addonService.getAll();
    res.json(addons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch addons' });
  }
});

app.post('/api/addons', async (req, res) => {
  try {
    const addon = await addonService.create(req.body);
    res.status(201).json(addon);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create addon' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});