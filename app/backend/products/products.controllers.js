import prisma from "../src/config/db.js";

// GET /products - Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// GET /products/:id - Get one product
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({ where: { id: Number(id) } });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// POST /products - Create a new product
export const createProduct = async (req, res) => {
  const { item, price, currency } = req.body;
  try {
    const newProduct = await prisma.product.create({
      data: { item, price: parseFloat(price), currency },
    });
    res.status(201).json(newProduct);
    const isDuplicate = false;
    const index = 0;
    while (!isDuplicate && index < products.length) {
      if (newProduct.item.id === req.body[index].item.id) {
        isDuplicate = true;
        res.status(400).json({ error: 'Item already exists with name' + ' ' + products[index].item.id });
      }
      index++;
    }
  }
   catch (error) {
    res.status(400).json({ error: 'Failed to create product' });
   }
};

// PUT /products/:id - Update an existing product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { price, currency } = req.body;
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: { price: parseFloat(price), currency },
    });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update product' });
  }
};

// DELETE /products/:id - Delete a product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({ where: { id: Number(id) } });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(404).json({ error: 'Failed to delete product' });
  }
};


