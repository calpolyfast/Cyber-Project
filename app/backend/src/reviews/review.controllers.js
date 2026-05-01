import prisma from "../config/db.js"
import { JSDOM } from "jsdom"

const validStarRatings = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0]

export const getReviews = async (req, res) => {
    try {
        const { productId } = req.params

        // 1. Verify the product exists
        const product = await prisma.product.findUnique({ where: { id: Number(productId) }})
        if (!product) {
            return res.status(404).json({ error: "Product not found" })
        }

        // 2. Fetch all related reviews
        const reviews = await prisma.review.findMany({
            where: { productId: Number(productId) },
            orderBy: {
                createdAt: 'desc',
            },
        })
        return res.status(200).json(reviews)
    }
    catch(err) {
        return res.status(500).json({ error: 'Server Error' })
    }
    
}

export const createReview = async (req, res) => {
    try {
        // 1. Get the user and product ids from the request
        const { userId } = req
        const { productId } = req.params

        // 2. Verify the required fields are provided
        const body = req.body
        const { comment, stars } = body
        if (!comment || !stars) {
            return res.status(400).json({ error: "Provide all required fields" })
        }
        if (validStarRatings.indexOf(Number(stars)) === -1) {
            return res.status(400).json({ error: "Provide a valid star rating (0.5, 1.0, 1.5...)" })
        }

        // 3. Create the review
        // Partially sanitize. The frontend removes characters '<' and '>', but the backend only removes <script></script> tags. The user can modify the request and use <img>
        const cleaned = comment.replace(/<\/?script>/gi, "")

        // Test cleaned comment for rendering HTML
        const dom = new JSDOM(comment);
        const domBody = dom.window.document.body;

        const hasHTML = Array.from(domBody.childNodes).some(
            node => node.nodeType === 1
        )

        console.log(hasHTML)

        const review = await prisma.review.create({
            data: {
                userId: Number(userId),
                productId: Number(productId),
                comment: cleaned,
                stars: Number(stars),
            }
        })
        const fullReview = await prisma.review.findUnique({
            where: { id: review.id },
            include: { product: true, user: true } 
        })

        if (hasHTML)
        {
            fullReview.flag = "flag{xss_in_product_review}"
        }

        return res.status(201).json(fullReview)
    }
    catch(err) {
        console.error(err)
        return res.status(500).json({ error: 'Server Error' })
    }
    
}