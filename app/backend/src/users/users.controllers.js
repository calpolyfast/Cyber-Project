<<<<<<< HEAD

export const loginController = async (req, res) => {

}

export const registerController = async (req, res) => {
    
=======
import jwt from "jsonwebtoken"
import prisma from "../config/db.js"

export const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if all required fields were provided
    if (!username || !email || !password) {
      return res.status(400)
        .json({ error: "Username, email, and password are required for user registration" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    })
    if (existingUser) {
      return res.status(400).json({ error: `Username ${username} is already taken` })
    }

    // IMPORTANT: Password is NOT hashed here
    const user = await prisma.user.create({
      data: { username, email, password, role: "User" },
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({error: "Failed to register user" });
  }
}

export const loginController = async (req, res) => {
    try{
      const { username, password } = req.body

      // Check if all required fields were provided
      if (!username || !password) {
        return res.status(400)
          .json({ error: "Username, email, and password are required for user authentication" });
      }
  
      // Check if user with provided credentials exists
      const user = await prisma.user.findUnique({
        where: { username }
      })
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid username or password" })
      }

      // Generate JWT token
      const JWT_SECRET = process.env.JWT_SECRET
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: '1h',
      });
      res.status(200).json({ token })
    }
    catch(err){
      console.error(err)
      res.status(500).json({ error: "Failed to authenticate user" })
    }
>>>>>>> b2dd9d5e86cbfd583cdfb72d662000192ff3cbbf
}