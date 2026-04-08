import prisma from "../config/db.js";

export const getAllAccounts = async (req, res) => {
    try {
        const accounts = await prisma.user.findMany();
        const sanitizedAccounts = accounts.map(account => ({
            id: account.id,
            username: account.username,
            email: account.email,
            role: account.role === 'User' ? 'Regular User' : 'Admin'
        }))
        res.status(200).json(sanitizedAccounts);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to fetch accounts' });
    }
};

export const getProfile = async (req, res) => {
    const id = req.userId
    try {
        const profile = await prisma.user.findUnique({
            where: { id: Number(id)} ,
        });
        if (!profile) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({
            id: profile.id,
            username: profile.username,
            email: profile.email,
            role: profile.role === 'User' ? 'Regular User' : 'Admin'
        });
    }
    catch (error) {
        res.status(500).json({error: 'Server Error'});
    }
};

export const updateAccount = async (req, res) => {
    const userId = req.userId
    const user = await prisma.user.findUnique({ where: { id: Number(userId) }})
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Verify user-provided fields are valid
    const { username, email } = req.body;
    if (!username || !email) {
        return res.status(400).json({ error: 'Username and email are required' });
    }

    // Verify the new username is not already in use by another account
    const existingUsername = await prisma.user.findUnique({ where: { username: String(username) }})
    if (existingUsername && existingUsername.id !== userId) {
        return res.status(400).json({ error: 'Username is already in use by another account' });
    }

    // Verify the new email is not already in use by another account
    const existingEmail = await prisma.user.findUnique({ where: { email: String(email) }})
    if (existingEmail && existingEmail.id !== userId) {
        return res.status(400).json({ error: 'Email is already in use by another account' });
    }

    try {
        const updatedAccount = await prisma.user.update({
            where: {
                id: Number(userId),
            },
            data: {
                username: String(username),
                email: String(email),
            }
        })
        const sanitizedAccount = {
            id: updatedAccount.id,
            username: updatedAccount.username,
            email: updatedAccount.email,
            role: updatedAccount.role === 'User' ? 'Regular User' : 'Admin'
        }
        res.status(200).json({ account: sanitizedAccount })
    }
    catch (error) {
        res.status(500).json({ error: 'Server Error' })
    }
}

export const deleteAccount = async (req, res) => {
    const userId = req.userId
    const user = await prisma.user.findUnique({ where: { id: Number(userId) }})
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    try {
        await prisma.user.delete({
            where: { id: Number(userId) },
        });
        res.status(204).json({ message: 'Account successfully deleted' });
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Server Error' });
    }
}