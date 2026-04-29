import jwt from "jsonwebtoken"
import prisma from "../config/db.js"

const verifyAdmin = async (req, res, next) => {
    // Verify the token
    try {
         // Retrieve the token from the cookie
        const token = req.cookies.token

        if(!token) {
            return res.status(401).json({ error: 'User is not logged in to an active session' })
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Getting the user's role from the JWT, expecting it to be secure unless they somehow altered it (by getting the secret)
        const role = decoded.role;
        const user = await prisma.user.findUnique({ where: { id: decoded.userId }})

        // Verify the user id is valid and the user is an Owner
        if(!user || role !== 'Admin'){
            return res.status(403).json({ error: 'User is invalid or not authorized to access this route' });
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