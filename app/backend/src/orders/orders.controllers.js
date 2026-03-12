import prisma from "../config/db.js"

export const createOrderController = async (req, res) => {
    const orderItems = req.body.orderItems
    if (!orderItems || orderItems.length < 1) {
        return res.status(400).json({ error: "An order must include 1 or more items" })
    }
    // Check all order items are for distant products
    const productIds = orderItems.map(item => item.productId)
    const uniqueProductIds = new Set(productIds)
    if (uniqueProductIds.size !== productIds.length) {
        return res.status(400).json({
            error: "Order items cannot use the same product in the same order"
        })
    }

    // For the purpose of exposing vulnerabilities,
    // we'll intentionally allow the client to set the price
    // in the request body instead of verifying based on the order items
    const totalPrice = req.body.totalPrice

    // However, we will still calculate the actual total price and compare it with the client-provided one
    // If they don't match, it means the user found the vulnerability and we will return the flag
    let actualTotalPrice = 0

    try {
        const order = await prisma.order.create({ data: {
            customerId: Number(req.userId),
            totalPrice
        }})

        for (const orderItem of orderItems) {
            // Verify the quantity
            if (!orderItem.quantity || orderItem.quantity < 0 || orderItem.quantity > 20) {
                return res.status(400).json({ 
                    error: "Any item's quantity must be positive and no greater than 20"
                })
            }
            // Verify the product exists
            if (!orderItem.productId || !await prisma.product.findFirst({
                where: { id: Number(orderItem.productId)},
                select: { id: true }
            })) {
                return res.status(400).json({
                    error: "Any item must correspond to a valid product"
                })
            }
            // Add the product * quantity to the actualTotalPrice
            const product = await prisma.product.findFirst({
                where: { id: Number(orderItem.productId)} })
            actualTotalPrice += product.price * orderItem.quantity
            // Create the order item
            await prisma.orderItem.create({
                data: {
                    quantity: orderItem.quantity,
                    productId: orderItem.productId,
                    orderId: order.id
                }
            })
        }

        // Retrieve the full order to return back to the client
        const fullOrder = await prisma.order.findUnique({
            where: { id: order.id },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        })

        // Add the flag if the total prices don't match
        // Note: Math.round() is used to round both numbers to 2 decimal places
        if (Math.round(totalPrice * 100) / 100 !== Math.round(actualTotalPrice * 100) / 100) {
            fullOrder["flag"] = "flag{client_side_order_manipulation}"
        }

        return res.status(201).json({
            data: fullOrder
        })
    } catch(err) {
        return res.status(500).json({ error: 'Server Error' })
    }
}

export const getUserOrdersController = async (req, res) => {
    try {
        const userOrders = await prisma.user.findUnique({
            where: { id: Number(req.userId) },
            select: {
                orders: {
                    include: {
                        orderItems: { include: { product: true } }
                    }
                }
            }
        })
        
        return res.status(200).json({ orders: userOrders.orders })
    } catch(err) {
        console.log(err)
        return res.status(500).json({ error: 'Server Error' })
    }
}