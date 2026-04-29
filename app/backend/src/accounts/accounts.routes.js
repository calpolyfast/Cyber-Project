import {
    getAllAccounts, getProfile,
    deleteAccount, updateAccount,
    changePassword
} from './accounts.controllers.js';
import verifyUser from '../middleware/verifyUser.js';
import verifyAdmin from '../middleware/verifyAdmin.js';
import { Router } from 'express';

const accountsRouter = Router()

accountsRouter.use(verifyUser)
accountsRouter.get('/me', getProfile);
accountsRouter.put('/', updateAccount);
accountsRouter.put('/change-password', changePassword)
accountsRouter.delete('/', deleteAccount);

accountsRouter.use(verifyAdmin)
accountsRouter.get('/', getAllAccounts);

export default accountsRouter






