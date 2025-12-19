import prisma from "../config/db.js";

// GET /products - Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error(error)
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

// GET /products/search?name=<name> - Search for products by name
export const searchProductByName = async (req, res) => {
    const { name } = req.query;
    if(!name) {
        return res.status(400).json({ error: "Missing search parameter: name" })
    }
    try {
        const products = await prisma.product.findMany({
            where: {
            name: {
                contains: name,
                mode: 'insensitive',
            },
            },
        });
        res.json(products);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to search products' });
    }
}

// POST /products - Create a new product
export const createProduct = async (req, res) => {
  const { name, price, visible } = req.body;
  if (name === undefined || price === undefined || visible === undefined){
    return res.status(400).json({ error: 'Missing required fields (name, price, visible) '})
  }
  const normalizedPrice = Number(parseFloat(price).toFixed(2))
  try {
    const newProduct = await prisma.product.create({
      data: { name, price: normalizedPrice, visible },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create product' });
  }
};

// PUT /products/:id - Update an existing product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, visible } = req.body;
  const normalizedPrice = Number(parseFloat(price).toFixed(2))
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: { name, price: normalizedPrice, visible },
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
    res.status(400).json({ error: 'Failed to delete product' });
  }
};


