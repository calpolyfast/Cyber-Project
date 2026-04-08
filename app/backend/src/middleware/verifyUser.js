import jwt from "jsonwebtoken"
import prisma from "../config/db.js"

const verifyUser = async (req, res, next) => {
    // Verify the token
    try {
        // Retrieve the token from the cookie
        const token = req.cookies.token

        if(!token) {
            return res.status(401).json({ error: 'User is not logged in to an active session' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id: decoded.userId }})

        // Verify the user id is valid
        if(!user){
            return res.status(401).json({ error: 'Invalid authentication token' });
        }

        // Attach the user id to the request object
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log("INVALID JWT")
        console.log(error)
        return res.status(401).json({ error: 'Invalid authentication token' });
    }
}
export default verifyUser