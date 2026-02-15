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
        const profile = await prisma.accounts.findUnique({
            where: { id: Number(id)} ,
            data: {email: String(email)},
            data: {password: String(password)}
        });
        res.json(profile);
    }
    catch (error) {
        res.status(404).json({error: 'Profile not found.'});
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const currentAccount = await prisma.accounts.findUnique({
            where: {id: Number(id)},
            data: {email: String(email)},
            data: {password: String(password)}
        });
        res.status(200).json({res: currentAccount + 'Account successfully deleted'})
    }
    catch (error) {
        res.status(404).json({error: 'Profile not found.'});
    }
}