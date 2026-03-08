import prisma from "../config/db.js";
import cloudinary from "../utils/cloudinary.js";

// GET /products - Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({ include: { image: true } });
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
    const product = await prisma.product.findUnique({ 
      where: { id: Number(id) },
      include: { image: true, reviews: {
        include: { user: true },
        orderBy: {
          createdAt: 'desc',
        },
      } }
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// GET /products/search?name=<name> - Search for products by name
export const getProductBySearchName = async (req, res) => {
    const { name } = req.query;
    if(!name) {
        return res.status(400).json({ error: "Missing search parameter: name" })
    }

    // Manually check if there is a flag
    const xssRegex = /<img[^>]*onerror\s*=\s*['"]?\s*alert\s*\(/i;
    if (xssRegex.test(name)) {
      return res.status(200).json({ flag: "flag{reflected_xss_in_search_parameter}" })
    }
    
    try {
        const products = await prisma.product.findMany({
            where: {
              name: {
                  contains: name,
                  mode: 'insensitive',
              },
            },
            include: { image: true }
        });
        res.json(products);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to search products' });
    }
}

// POST /products - Create a new product
export const createProduct = async (req, res) => {
  // Check validity of required fields
  let { name, price, visible } = req.body;
  if (!name || !price || !visible){
    return res.status(400).json({ error: 'Missing required fields (name, price, visible) '})
  }
  visible = visible === 'true' || visible === true

  // Normalize price to 2 decimal places
  const normalizedPrice = Number(parseFloat(price).toFixed(2))

  // Upload image to cloudinary if image is provided
  let uploadedImage
  try{
    if(req.file){
      const image = await cloudinary.uploader.upload(req.file.path);
      if (!image) {
          return res.status(500).json({ success: false, message: 'Image upload failed' });
      }
      uploadedImage = {
        url: image.secure_url,
        public_id: image.public_id
      };
    }
  }
  catch(err){
    console.error(err)
    return res.status(500).json({ 
      error: `Image upload failed. New product '${name}' could not be created` 
    });
  }
  
  // Create product in db
  try {
    const newProduct = await prisma.product.create({
      data: { 
        name, 
        price: normalizedPrice, 
        image: uploadedImage ? { create: uploadedImage } : undefined,
        visible 
      },
      include: { image: true}
    });
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create product' });
  } 
};

// PUT /products/:id - Update an existing product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  let { name, price, visible } = req.body;
  visible = visible === 'true' || visible === true
  const normalizedPrice = Number(parseFloat(price).toFixed(2))

  let updatedImage
  if (req.file) {
    try {
      // Delete old iamge from cloudinary
      const { image: oldImage } = await prisma.product.findUnique({ 
        where: { id: Number(id) },
        include: { image: true }
      });
      if (oldImage) {
        await cloudinary.uploader.destroy(oldImage.public_id);
      }
      // Upload new image
      const image = await cloudinary.uploader.upload(req.file.path);
      if (!image) {
        return res.status(500).json({ success: false, message: 'Image upload failed' });
      }
      updatedImage = {
        url: image.secure_url,
        public_id: image.public_id
      };
    } catch (err) {
      console.error(err)
      return res.status(500).json({ 
        error: `Image upload failed. Product '${name}' could not be updated` 
      });
    }
  }
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: { 
        name, 
        price: normalizedPrice, 
        visible, 
        image: updatedImage ? { 
          upsert: { create: updatedImage, update: updatedImage } 
        } : undefined
      },
      include: { image: true }
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


