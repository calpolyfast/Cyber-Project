jest.mock("../src/config/db.js", () => ({
    __esModule: true,
    default: {
        users: {
            findUnique: jest.fn(),
        },
        products: {
            findUnique: jest.fn(),
        },
        orderItems: {
            create: jest.fn(),
        },
        orders: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
        }
    }
}))

import prisma from "../src/config/db.js"
import { createOrderController, getUserOrdersController } from "../src/orders/orders.controllers.js"

const mockReq = (body = {}, params = {}) => ({ body, params })
const mockRes = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
}

describe('createOrderController tests', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('createOrder successfully creates a new order in db', async () => {
        const mockUser = { id: 1, name: 'Bobby' }
        const mockProducts = [
            { id: 1, name: 'Product 1', price: 10.0 },
            { id: 2, name: 'Product 2', price: 20.0 }
        ]
        const mockOrderItems = [
            { productId: 1, name: 'Product 1', quantity: 2 },
            { productId: 2, name: 'Product 2', quantity: 1 },
        ]
        const mockOrder = {
            id: 1,
            userId: 1,
            totalAmount: 40.0,
            items: mockOrderItems,
            date: new Date(),
        }
        const mockReqData = {
            user: 1,
            items: mockOrderItems
        }

        // Mock prisma user call
        prisma.users.findUnique.mockResolvedValue(mockUser)

        // Mock prisma product calls
        prisma.products.findUnique.mockImplementation(({ where }) => {
            if (where.id === 1) {
                return Promise.resolve(mockProducts[0]);
            }
            if (where.id === 2) {
                return Promise.resolve(mockProducts[1]);
            }
            return Promise.resolve(null); // fallback for unhandled IDs
        });

        // Mock prisma order creation
        prisma.orderItems.create.mockImplementation(({ data }) => {
            if(data.productId === 1) {
                return Promise.resolve({ id: 1, ...data, })
            }
            if(data.productId === 2) {
                return Promise.resolve({ id: 2, ...data, })
            }
            return Promise.resolve(null)
        })
        prisma.orders.create.mockResolvedValue({
            id: 1,
            userId: mockUser.id,
            totalAmount: 40.0,
            items: mockOrderItems
        })

        const req = mockReq(mockReqData, {})
        const res = mockRes()

        await createOrderController(req, res)

        expect(prisma.users.findUnique).toHaveBeenCalledWith({
            where: { id: 1 }
        })
        expect(prisma.products.findUnique).toHaveBeenCalledTimes(2)
        expect(prisma.orderItems.create).toHaveBeenCalledTimes(2)
        expect(prisma.orders.create).toHaveBeenCalledWith({
            data: {
                userId: 1,
                totalAmount: 40.0,
                items: mockOrderItems,
                date: expect.any(Date)
            }
        })
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith(mockOrder)
    })

    test('createOrder returns 400 if user not found', async () => {
        const mockReqData = {
            user: 999,
            items: [
                { productId: 1, quantity: 2 }
            ]
        }

        // Mock prisma user call to return null
        prisma.users.findUnique.mockResolvedValue(null)

        const req = mockReq(mockReqData, {})
        const res = mockRes()

        await createOrderController(req, res)

        expect(prisma.users.findUnique).toHaveBeenCalledWith({
            where: { id: 999 }
        })
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({
            error: 'User not found'
        })
    })

    test('createOrder returns 400 if a product is not found', async () => {
        const mockReqData = {
            user: 1,
            items: [
                { productId: 1, quantity: 2 }
            ]
        }

        const mockUser = { id: 1, name: 'Bobby' }

        // Mock prisma user call
        prisma.users.findUnique.mockResolvedValue(mockUser)

        // Mock prisma product call to return null
        prisma.products.findUnique.mockResolvedValue(null)

        const req = mockReq(mockReqData, {})
        const res = mockRes()

        await createOrderController(req, res)

        expect(prisma.users.findUnique).toHaveBeenCalledWith({
            where: { id: 1 }
        })
        expect(prisma.products.findUnique).toHaveBeenCalledWith({
            where: { id: 1 }
        })
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({
            error: 'Product with id 999 not found'
        })
    })

    test('createOrder returns 400 if items provides duplicate product ids', async () => {
        const mockReqData = {
            user: 1,
            items: [
                { productId: 1, quantity: 2 },
                { productId: 1, quantity: 3 }
            ]
        }

        prisma.users.findUnique.mockResolvedValue({ id: 1, name: 'Bobby' })
        prisma.products.findUnique.mockResolvedValue({ id: 1, name: 'Product 1', price: 10.0 })

        const req = mockReq(mockReqData, {})
        const res = mockRes()

        await createOrderController(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({
            error: 'Duplicate products in order items are not allowed'
        })
    })
})

describe('getUserOrdersController tests', () => {
    test('getUserOrders successfully returns orders for the current user', async () => {
        const mockOrders = [
            {
                id: 1,
                userId: 1,
                totalAmount: 30.0,
                items: [
                    { productId: 1, name: 'Product 1', quantity: 2 },
                    { productId: 2, name: 'Product 2', quantity: 1 },
                ],
                date: new Date(),
            },
            {
                id: 2,
                userId: 1,
                totalAmount: 20.0,
                items: [
                    { productId: 3, name: 'Product 3', quantity: 1 },
                ],
                date: new Date(Date.now() - 1000),
            }
        ]

        // Mock prisma orders call
        prisma.orders.findMany.mockResolvedValue(mockOrders)

        const req = mockReq({}, { userId: '1' })
        const res = mockRes()

        await getUserOrdersController(req, res)

        expect(prisma.orders.findMany).toHaveBeenCalledWith({
            where: { userId: 1 },
            orderBy: { date: 'desc' }
        })
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(mockOrders)
    })

    test('getUserOrders returns empty array if user has no orders', async () => {
        // Mock prisma orders call
        prisma.orders.findMany.mockResolvedValue([])

        const req = mockReq({}, { userId: '1' })
        const res = mockRes()

        await getUserOrdersController(req, res)

        expect(prisma.orders.findMany).toHaveBeenCalledWith({
            where: { userId: 1 },
            orderBy: { date: 'desc' }
        })
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(mockOrders)
    })

    test('getUserOrders returns 404 if user not found', async () => {
        // Mock prisma orders call to return null
        prisma.users.findUnique.mockResolvedValue(null)

        const req = mockReq({}, { userId: '999' })
        const res = mockRes()

        await getUserOrdersController(req, res)

        expect(prisma.users.findUnique).toHaveBeenCalledWith({
            where: { id: 999 }
        })

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({
            error: 'User not found'
        })
    })
})