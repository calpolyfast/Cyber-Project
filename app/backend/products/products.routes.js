import { Router } from 'express';
import { getAllProducts } from './products.controllers.js';

const productsRouter = Router()

products.get('/products', getAllProducts);

export default productsRouter