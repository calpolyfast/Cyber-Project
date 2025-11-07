import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


// GET /prices - Get all prices
export const getAllPrices = async (req, res) => {
  try {
    const prices = await prisma.price.findMany();
    res.json(prices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
};

// GET /prices/:id - Get one price
export const getPriceById = async (req, res) => {
  const { id } = req.params;
  try {
    const price = await prisma.price.findUnique({ where: { id: Number(id) } });
    if (!price) return res.status(404).json({ error: 'Price not found' });
    res.json(price);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch price' });
  }
};

// POST /prices - Create a new price
export const createPrice = async (req, res) => {
  const { item, amount, currency } = req.body;
  try {
    const newPrice = await prisma.price.create({
      data: { item, amount: parseFloat(amount), currency },
    });
    res.status(201).json(newPrice);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create price' });
  }
};

// PUT /prices/:id - Update an existing price
export const updatePrice = async (req, res) => {
  const { id } = req.params;
  const { amount, currency } = req.body;
  try {
    const updatedPrice = await prisma.price.update({
      where: { id: Number(id) },
      data: { amount: parseFloat(amount), currency },
    });
    res.json(updatedPrice);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update price' });
  }
};

// DELETE /prices/:id - Delete a price
export const deletePrice = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.price.delete({ where: { id: Number(id) } });
    res.json({ message: 'Price deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete price' });
  }
};


