import prisma from "../src/config/db.js";

// This script is used to populate the db with some users and products
// It is intended to be run on server startup, but can also be run manually with `node populateDB.js`
export const populateUsersAndProducts = async () => {
    // Create list of users to be added to the db
    const users = [
        {
            username: "admin",
            password: "admin123",
            email: "admin@example.com",
            role: "User",
        },
        {
            username: "john_doe",
            password: "password123",
            email: "",
            role: "User",
        }
    ]

    // Add users to the db if not already present
    users.forEach(async (user) => {
        const existingUser = await prisma.user.findUnique({
            where: {
                username: user.username
            }
        })
        
        if (!existingUser) {
            await prisma.user.create({
                data: user
            })
            console.log(`Created user ${user.username}`)
        }
    })

    // Create list of products to be added to the db
    const products = [
        {
            name: "Summer squash",
            price: 12.99,
            visible: true
        },
        {
            name: "Tomatoes",
            price: 3.99,
            visible: true
        },
        {
            name: "Peppers",
            price: 4.49,
            visible: true
        },
        {
            name: "Cucumbers",
            price: 2.99,
            visible: true
        },
        {
            name: "Eggplant",
            price: 5.99,
            visible: true
        },
        {
            name: "Corn",
            price: 1.99,
            visible: true
        },
        {
            name: "Watermelon",
            price: 8.99,
            visible: true
        },
        {
            name: "Dragon Fruit",
            price: 7.99,
            visible: true
        },
        {
            name: "Avocados (Hass, Reed, Lamb Hass)",
            price: 6.99,
            visible: true
        },
        {
            name: "Ruby Red grapefruit",
            price: 4.99,
            visible: true
        }
    ]

    // Add products to the db if not already present
    let numOfProductsCreated = 0
    products.forEach(async (product) => {
        const existingProduct = await prisma.product.findUnique({
            where: {
                name: product.name
            }
        })

        if (!existingProduct) {
            await prisma.product.create({
                data: product
            })
            numOfProductsCreated += 1
        }
    })
}

// This function is used to populate the orders table with some orders for a given user
// It is intended to be run on user registration
export const populateOrdersForUser = async (userId) => {
    // Check if the user id is valid
    const user = await prisma.user.findUnique({
        where: { id: userId }
    })
    if (!user) {
        throw new Error(`User with id ${userId} does not exist`)
    }

    const arbitraryProductIds = await prisma.product.findMany({
        take: 6,
        select: { id: true }
    })

    // Throw an error if there are not enough products in the db
    if (arbitraryProductIds.length < 6) {
        throw new Error("Not enough products in the database to populate orders")
    }

    // Create two orders for the user with arbitrary products and quantities
    let order1 = await prisma.order.create({
        data: {
            customerId: userId,
            totalPrice: 0, // Will be updated after creating order items
        }
    })

    const orderItems1 = [
        {
            productId: arbitraryProductIds[0].id,
            quantity: 2,
            orderId: order1.id
        },
        {
            productId: arbitraryProductIds[1].id,
            quantity: 1,
            orderId: order1.id
        },
        {
            productId: arbitraryProductIds[2].id,
            quantity: 3,
            orderId: order1.id
        }
    ]

    await prisma.orderItem.createMany({
        data: orderItems1
    })

    let order2 = await prisma.order.create({
        data: {
            customerId: userId,
            totalPrice: 0, // Will be updated after creating order items
        }
    })

    const orderItems2 = [
        {
            productId: arbitraryProductIds[0].id,
            quantity: 1,
            orderId: order2.id
        },
        {
            productId: arbitraryProductIds[4].id,
            quantity: 4,
            orderId: order2.id
        },
        {
            productId: arbitraryProductIds[5].id,
            quantity: 3,
            orderId: order2.id
        }
    ]

    await prisma.orderItem.createMany({
        data: orderItems2
    })
}