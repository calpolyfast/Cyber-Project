import {
    getAllAccounts, getProfile,
    deleteAccount
} from './accounts.controllers.js';
import { Router } from 'express';

const accountsRouter = Router()
accountsRouter.get('/', getAllAccounts);
accountsRouter.get('/profile', getProfile);






