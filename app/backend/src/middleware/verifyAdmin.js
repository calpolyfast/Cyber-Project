import jwt from "jsonwebtoken"
import prisma from "../config/db.js"

const verifyAdmin = async (req, res, next) => {
    // Verify the token
    try {
        // Check if token is included
        let token = req.header('Authorization')
        if(!token) {
            return res.status(401).json({ error: 'User is not logged in to an active session' })
        }

        // Remove 'Bearer ' prefix if it exists
        if(token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id: decoded.userId }})

        // Verify the user id is valid and the user is an Admin
        if(!user || user.role !== 'Admin'){
            console.log(user.role)
            return res.status(401).json({ error: 'User does not have Admin role' });
        }

        // Attach the user id to the request object
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: 'Invalid authentication token' });
    }
}
export default verifyAdmin