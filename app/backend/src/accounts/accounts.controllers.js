import { json } from "express";

export const getAllAccounts = async (req, res) => {
    try {
        const accounts = await prisma.accounts.findMany();
        res.json(accounts);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to fetch accounts' });
    }
};

export const getProfile = async (req, res) => {
    try {
        const profile = await prisma.accounts.findUnique();
    }