import prisma from "../config/db.js";

export const createPerson = async (req, res) => {
  try {
    const { name, email, phone, pass, social } = req.body;

    const pers = await prisma.person.create({
      data: { name, email, phone, pass, social },
    });

    res.status(201).json(pers);
  } catch (err) {
    res.status(400).json({error: err.message});
  }
}