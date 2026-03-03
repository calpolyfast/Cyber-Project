import {
    getAllAccounts, getProfile,
    deleteAccount, updateAccount
} from './accounts.controllers.js';
import { Router } from 'express';

const accountsRouter = Router()
accountsRouter.get('/', getAllAccounts);
accountsRouter.get('/profile', getProfile);
accountsRouter.delete('/delete', deleteAccount);
accountsRouter.get('/update', updateAccount);






