import { Router } from 'express';
import { getAllProducts } from './products.controllers.js';

const productsRouter = Router()

productsRouter.get('/products', getAllProducts);

export default productsRouter