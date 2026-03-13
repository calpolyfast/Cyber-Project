import prisma from "../config/db.js"

export const getInvoiceByOrderId = async (req, res) => {
    const { orderId } = req.params

    try {
        const invoice = await prisma.invoice.findUnique({
            where: { orderId: Number(orderId) },
            select: { 
                order: {
                    include: {
                        orderItems: {
                            include: { product: true }
                        }
                    } 
                }
            }
        })

        // Modify the product field to only include the product id and name
        invoice.order.orderItems.forEach(orderItem => {
            return {
                productId: orderItem.product.id,
                name: orderItem.product.name,
                quantity: orderItem.quantity
            }
        })

        return res.status(200).json(invoice)
    }
    catch(err) {
        return res.status(500).json({ error: 'Server Error' })
    }
}