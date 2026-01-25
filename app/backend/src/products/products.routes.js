import { Router } from 'express';
import { 
    getAllProducts, getProductById, 
    getProductBySearchName, createProduct, 
    updateProduct, deleteProduct 
} from './products.controllers.js';
import upload from '../middleware/multer.js';
import verifyOwner from '../middleware/verifyOwner.js';

const productsRouter = Router()

productsRouter.get('/', getAllProducts)
productsRouter.get('/search', getProductBySearchName)
productsRouter.get('/:id', getProductById)

productsRouter.use(verifyOwner)
productsRouter.delete('/:id', deleteProduct)
// Add middleware 'upload.single('image')' to handle image upload
productsRouter.post('/', upload.single('image'), createProduct)
productsRouter.put('/:id', upload.single('image'), updateProduct)

export default productsRouter