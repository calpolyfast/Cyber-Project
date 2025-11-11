import prisma from "../config/db.js";

export const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const pers = await prisma.user.create({
      data: { name, email, password },
    });

    res.status(201).json(pers);
  } catch (err) {
    res.status(400).json({error: err.message});
  }
}

export const loginController = async (req, res) => {
    
}