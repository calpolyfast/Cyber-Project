import prisma from "../src/config/db.js";
import reviewPool from "../resources/reviewPool.js";

// This script is used to populate the db with some users and products
// It is intended to be run on server startup, but can also be run manually with `node populateDB.js`
export const populateUsers = async () => {
    // Create list of users to be added to the db
    const users = [
        {
            username: "admin",
            password: "thebigcheese#123",
            email: "admin@example.com",
            role: "Admin",
        },
        {
            username: "john_doe",
            password: "password123",
            email: null,
            role: "User",
        }, 
        {
            username: "jane_smith",
            password: "password456",
            email: null,
            role: "User",
        }
    ]

    // Add users to the db if not already present
    await Promise.all(
        users.map(async (user) => {
            const existingUser = await prisma.user.findUnique({
                where: {
                    username: user.username
                }
            })
            
            if (!existingUser) {
                const newUser = await prisma.user.create({
                    data: user
                })
                console.log(`Created user ${user.username}`)
                
                try {
                    populateOrdersForUser(newUser.id)
                } catch (error) {
                    console.error("Could not populate orders for user: ", error)
                }
            }
        })
)
}

export const populateProducts = async () => {
    // Create list of products to be added to the db
    const products = [
        {
            name: "Summer squash",
            price: 12.99,
            visible: true, 
            image: {
                create: {
                    url: "https://res.cloudinary.com/dwctdab9a/image/upload/v1776559830/image7_kg93qt.jpg",
                    public_id: "image11_r4fvrb.png",
                }
            }
        },
        {
            name: "Tomatoes",
            price: 3.99,
            visible: true, 
            image: {
                create: {
                    url: "https://res.cloudinary.com/dwctdab9a/image/upload/v1776559829/image2_fps5d0.jpg",
                    public_id: "image2_fps5d0.jpg",
                }
            }
        },
        {
            name: "Peppers",
            price: 4.49,
            visible: true, 
            image: {
                create: {
                    url: "https://res.cloudinary.com/dwctdab9a/image/upload/v1776559829/image8_bycvaw.jpg",
                    public_id: "image8_bycvaw.jpg",
                }
            }
        },
        {
            name: "Cucumbers",
            price: 2.99,
            visible: true, 
            image: {
                create: {
                    url: "https://res.cloudinary.com/dwctdab9a/image/upload/v1776559829/image12_nzco1g.jpg",
                    public_id: "image12_nzco1g.jpg",
                }
            }
        },
        {
            name: "Eggplant",
            price: 5.99,
            visible: true, 
            image: {
                create: {
                    url: "https://res.cloudinary.com/dwctdab9a/image/upload/v1776559830/image6_gdjf4x.jpg",
                    public_id: "image6_gdjf4x.jpg",
                }
            }
        },
        {
            name: "Corn",
            price: 1.99,
            visible: true, 
            image: {
                create: {
                    url: "https://res.cloudinary.com/dwctdab9a/image/upload/v1776559830/image4_zr2zem.jpg",
                    public_id: "image4_zr2zem.jpg",
                }
            }
        },
        {
            name: "Watermelon",
            price: 8.99,
            visible: true, 
            image: {
                create: {
                    url: "https://res.cloudinary.com/dwctdab9a/image/upload/v1776559830/image10_zw2av4.jpg",
                    public_id: "image10_zw2av4.jpg",
                }
            }
        },
        {
            name: "Dragon Fruit",
            price: 7.99,
            visible: true, 
            image: {
                create: {
                    url: "https://res.cloudinary.com/dwctdab9a/image/upload/v1776559829/image1_cagx1b.jpg",
                    public_id: "image1_cagx1b.jpg",
                }
            }
        },
        {
            name: "Avocados (Hass, Reed, Lamb Hass)",
            price: 6.99,
            visible: true, 
            image: {
                create: {
                    url: "https://res.cloudinary.com/dwctdab9a/image/upload/v1776559831/image11_r4fvrb.png",
                    public_id: "image11_r4fvrb.png",
                }
            }
        },
        {
            name: "Ruby Red grapefruit",
            price: 4.99,
            visible: true, 
            image: {
                create: {
                    url: "https://res.cloudinary.com/dwctdab9a/image/upload/v1776559830/image5_shlxqq.jpg",
                    public_id: "image5_shlxqq.jpg",
                }
            }
        }
    ]

    // Add products to the db if not already present
    const createdIds = []
    await Promise.all(
        products.map(async (product) => {
            const existingProduct = await prisma.product.findUnique({
                where: {
                    name: product.name
                }
            })

            if (!existingProduct) {
                const createdProduct = await prisma.product.create({
                    data: product
                })

                createdIds.push(createdProduct.id);
            }
        })
    )
    return createdIds
}

// This function is intended to be used within populateProducts() to generate reviews for the products being added to the db
export const generateReviews = async (productId) => {

    const commentPool = reviewPool

    const reviewsN = Math.floor(Math.random() * 10) + 5; // Generate between 5 - 10 reviews per product
    for (let i = 0; i < reviewsN; i++ ) {
        const randomUser = (
            await prisma.user.findMany({
                take: 1,
                skip: Math.floor((await prisma.user.count()) * Math.random()),
            })
        )[0]

        // Randomly assign a star rating and comment based on the generated rating
        const starsN = Math.floor(Math.random() * 5) + 1 + ( Math.random() > 0.5 ? 0.5 : 0 )
        let comment = ""
        if (starsN <= 2) {
            comment = commentPool.bad[Math.floor(Math.random() * commentPool.bad.length)]
        } else if (starsN <= 4) {
            comment = commentPool.mid[Math.floor(Math.random() * commentPool.mid.length)]
        } else {
            comment = commentPool.good[Math.floor(Math.random() * commentPool.good.length)]
        }

        await prisma.review.create({ data: {
            productId: productId,
            userId: randomUser.id,
            comment: comment,
            stars: starsN
        } })
    }
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
    const products = await prisma.product.findMany({
        where: {
            id: { in: arbitraryProductIds.map(p => p.id) }
        }
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
    const invoice1 = {
        data: {
            order: {
                connect: { id: order1.id }
            },
            username: user.username,
            email: user.email || "default@fastfarmstore.com"
        }
    }
    
    orderItems1.totalPrice = orderItems1.reduce((acc, item) => {
        const product = products.find(p => p.id === item.productId)
        return acc + product.price * item.quantity
    }, 0)

    const newInvoice1 = await prisma.invoice.create(invoice1)
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
    const invoice2 = {
        data: {
            order: {
                connect: { id: order2.id }
            },
            username: user.username,
            email: user.email || userId > 1 ? "flag{invoice_idor_0502efea-58fe-4ffc-8b8b-f239728693a9}" : "default@fastfarmstore.com"
        }
    }
    
    orderItems2.totalPrice = orderItems2.reduce((acc, item) => {
        const product = products.find(p => p.id === item.productId)
        return acc + product.price * item.quantity
    }, 0)


    const newInvoice2 = await prisma.invoice.create(invoice2)
    await prisma.orderItem.createMany({
        data: orderItems2
    })
}