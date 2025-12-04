import { Router } from 'express';
import { getAllProducts, createProduct, getProductById, searchProductByName } from './products.controllers.js';

const productsRouter = Router()

productsRouter.get('/', getAllProducts)
productsRouter.get('/search', searchProductByName)
productsRouter.get('/:id', getProductById)
productsRouter.post('/', createProduct)

export default productsRouter