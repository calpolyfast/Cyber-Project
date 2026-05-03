import prisma from "../config/db.js"

export const createOrderController = async (req, res) => {
    const orderItems = req.body.orderItems

    if (!orderItems || orderItems.length < 1) {
        return res.status(400).json({ error: "An order must include 1 or more items" })
    }

    // Check all order items are for distinct products
    const productIds = orderItems.map(item => item.productId)
    const uniqueProductIds = new Set(productIds)

    if (uniqueProductIds.size !== productIds.length) {
        return res.status(400).json({
            error: "Order items cannot use the same product in the same order"
        })
    }

    const totalPrice = req.body.totalPrice

    // However, we will still calculate the actual total price and compare it with the client-provided one
    // If they don't match, it means the user found the vulnerability and we will return the flag
    let actualTotalPrice = 0

    try {
        const fullOrder = await prisma.$transaction(async (tx) => {

            // Create the order
            const order = await tx.order.create({
                data: {
                    customerId: Number(req.userId),
                    totalPrice
                }
            })

            for (const orderItem of orderItems) {

                // Verify quantity
                if (!orderItem.quantity || orderItem.quantity < 0 || orderItem.quantity > 20) {
                    throw new Error("INVALID_QUANTITY")
                }

                // Verify product exists
                const product = await tx.product.findUnique({
                    where: { id: Number(orderItem.productId) },
                    select: { id: true }
                })

                if (!product) {
                    throw new Error("INVALID_PRODUCT")
                }
                
                // Add the product * quantity to the actualTotalPrice
                actualTotalPrice += product.price * orderItem.quantity
                // Create the order item
                await tx.orderItem.create({
                    data: {
                        quantity: orderItem.quantity,
                        productId: orderItem.productId,
                        orderId: order.id
                    }
                })
            }

            // Get user info
            const user = await tx.user.findUnique({
                where: { id: req.userId }
            })

            // Create invoice
            await tx.invoice.create({
                data: {
                    order: {
                        connect: { id: order.id }
                    },
                    username: user.username,
                    email: user.email || "default@fastfarmstore.com"
                }
            })

            // Return the completed order
            return tx.order.findUnique({
                where: { id: order.id },
                include: {
                    orderItems: {
                        include: {
                            product: true
                        }
                    },
                invoice: true
                }
            })
        })

        // Add the flag if the total prices don't match
        // Note: Math.round() is used to round both numbers to 2 decimal places
        if (Math.round(totalPrice * 100) / 100 !== Math.round(actualTotalPrice * 100) / 100) {
            fullOrder["flag"] = "flag{business_logic_1bf5a9da-9ff1-4d54-97fc-d9cddedafdc8}"
        }

        return res.status(201).json({
            data: fullOrder
        })

    } catch (err) {

        if (err.message === "INVALID_QUANTITY") {
            return res.status(400).json({
                error: "Any item's quantity must be positive and no greater than 20"
            })
        }

        if (err.message === "INVALID_PRODUCT") {
            return res.status(400).json({
                error: "Any item must correspond to a valid product"
            })
        }

        console.error(err)
        return res.status(500).json({ error: "Server Error" })
    }
}

export const getUserOrdersController = async (req, res) => {
    try {
        const userOrders = await prisma.user.findUnique({
            where: { id: Number(req.userId) },
            select: {
                orders: {
                    include: {
                        orderItems: { include: { product: true } },
                        invoice: true
                    }
                }
            }
        })
        
        return res.status(200).json({ orders: userOrders.orders })
    } catch(err) {
        return res.status(500).json({ error: 'Server Error' })
    }
}