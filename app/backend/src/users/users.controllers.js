import jwt from "jsonwebtoken"
import prisma from "../config/db.js"
import { populateOrdersForUser } from "../../scripts/populateDB.js";

export const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if all required fields were provided
    if (!username || !password) {
      return res.status(400)
        .json({ error: "Username and password are required for user registration" });
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
      data: { username, email: email || null, password, role: "User" },
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({error: "Failed to register user" });
    console.log(err)
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

      const query = `SELECT *
        FROM "User"
        WHERE username = '${username}'
      `
  
      // Use unsafe raw query to allow for potential SQL injection vulnerability
      const users = await prisma.$queryRawUnsafe(query)

      // Determine whether the username in the request body was attempted sql injection
      const sqlInjectionPattern =
      /(\bUNION\b|\bSELECT\b|\bDROP\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bOR\b|\bAND\b|--|;|\/\*|\*\/)/i
      const isSqlInjection = sqlInjectionPattern.test(username)

      // Verify the user was found and password matches
      const user = users[0]
      if (!user || user.password !== password) {
        console.log(user)
        console.log("invalid")
        return res.status(401).json({ error: "Invalid username or password" })
      }

      // Generate JWT token
      const JWT_SECRET = process.env.JWT_SECRET
      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: '1h',
      });

      res.cookie('token', token, {
        httpOnly: true,        // JS can't access
        secure: false,          // HTTPS only (set false for local dev)
        sameSite: 'lax',    // use 'strict' for actual CSRF protection
        maxAge: 60 * 60 * 1000 // 1 hour
      })

      // I included the token in the request body to leave potential for other vulnerabilities
      const resBody = { id: user.id, token }

      // If sqlInjectin was successfully performed, add the flag field
      if (isSqlInjection){
        resBody["flag"] = "flag{sql_injection_login_bypass_e660ad6c-2821-4233-8ac1-ece48925732e}"
      }
      
      res.status(200).json(resBody)
    }
    catch(err){
      console.error(err)
      res.status(500).json({ error: err })
    }
}

export const logoutController = async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'User logged out' });
}