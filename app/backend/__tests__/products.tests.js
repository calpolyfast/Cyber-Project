jest.mock("../src/config/db.js", () => ({
    __esModule: true,
    default: {
        product: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
        }
    }
}))

import prisma from "../src/config/db.js"
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../products/products.controllers.js"

const mockReq = (body = {}, params = {}) => ({ body, params })
const mockRes = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
}

describe('Product Controllers', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('getAllProducts returns list of all alphabetically sorted products in db', async () => {
        const mockProductData = [
            { id: 1, name: 'Bag', description: 'A really cool bag', price: 49.99 },
            { id: 2, name: 'Another Bag', description: 'A really cool bag', price: 49.99 },
            { id: 3, name: 'Shoe', description: 'A really trash shoe', price: 6.70 },
        ]
        const sortedProductData = mockProductData.sort((a, b) => a.name.localeCompare(b.name))

        // Mock the prisma findMany call
        prisma.product.findMany.mockResolvedValue(mockProductData)

        const req = mockReq()
        const res = mockRes()

        await getAllProducts(req, res)

        expect(prisma.product.findMany).toHaveBeenCalledWith({
            orderBy: { name: 'asc' },
        })
        expect(prisma.product.findMany).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(sortedProductData)
    })

    test('getProductById successfully returns product from db', async () => {
        const mockProduct = {
            id: 1,
            name: 'Bag',
            description: 'A really cool bag',
            price: 49.99
        }

        prisma.product.findUnique.mockResolvedValue(mockProduct)

        const req = mockReq({}, { id: '1' })
        const res = mockRes()

        await getProductById(req, res)

        expect(prisma.product.findUnique).toHaveBeenCalledWith({
            where: { id: 1 }
        })
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(mockProduct)
    })

    test('getProductById returns 404 and error message when product not found', async () => {
        prisma.product.findUnique.mockResolvedValue(null)

        const req = mockReq({}, { id: '1' })
        const res = mockRes()

        await getProductById(req, res)

        expect(prisma.product.findUnique).toHaveBeenCalledWith({
            where: { id: 1 }
        })
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' })
    })

    test('createProduct successfully creates a new product in db', async () => {
        const mockReqData = {
            name: 'Bag',
            description: 'A really cool bag',
            price: 49.99
        }
        const mockCreatedProduct = {
            id: 1,
            ...mockReqData
        }

        prisma.product.create.mockResolvedValue(mockCreatedProduct)

        const req = mockReq(mockReqData, {})
        const res = mockRes()

        await createProduct(req, res)

        expect(prisma.product.create).toHaveBeenCalledWith({
            data: {
                name: 'Bag',
                description: 'A really cool bag',
                price: 49.99
            }
        })
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith(mockCreatedProduct)
    })

    test('createProduct returns 400 if another product with same name already exists', async () => {
        const mockReqData = {
            name: 'Bag',
            description: 'A really cool bag',
            price: 49.99
        }
        const mockExistingProduct = {
            name: 'Bag',
            description: 'This is another bag',
            price: 67.00
        }

        prisma.product.findUnique.mockResolvedValue(mockExistingProduct)

        const req = mockReq(mockReqData, {})
        const res = mockRes()

        await createProduct(req, res)

        expect(prisma.product.findUnique).toHaveBeenCalledWith({
            where: { name: 'Bag' }
        })

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ error: 'Product with name Bag already exists. Please choose a different name.' })
    })

    test('createProduct checks fields are all valid', async () => {
        const mockReqData = {
            name: '',
            description: 'A really cool bag',
            price: -49.99
        }

        const req = mockReq(mockReqData, {})
        const res = mockRes()

        await createProduct(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
    })

    test('deleteProduct successfully deletes product from db', async () => {
        prisma.product.delete.mockResolvedValue({ id: '1', name: 'Bag' })

        const req = mockReq({}, { id: '1' })
        const res = mockRes()

        await deleteProduct(req, res)

        expect(prisma.product.delete).toHaveBeenCalledWith({
            where: { id: 1 }
        })
        expect(res.status).toHaveBeenCalledWith(204)
        expect(res.json).toHaveBeenCalledWith({ message: "Product 'Bag' deleted successfully" })
    })

    test('deleteProduct returns 400 if product to delete does not exist', async () => {
        prisma.product.delete.mockImplementation(() => {
            throw new Error()
        })

        const req = mockReq({}, { id: '1' })
        const res = mockRes()

        await deleteProduct(req, res)

        expect(prisma.product.delete).toHaveBeenCalledWith({
            where: { id: 1 }
        })
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ error: 'Product could not be found' })
    })
})