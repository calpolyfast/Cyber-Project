import express from 'express'
import dotenv from 'dotenv'
import prisma from './config/db.js'
import cors from 'cors'
import options from './cors_options.js'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url';
import { execSync } from "node:child_process"

import UserRouter from './users/users.routes.js'
import VulnerabilityGroupRouter from './vulnerabilityGroups/vulnerabilityGroups.routes.js'
import VulnerabilityRouter from './vulnerabilities/vulnerabilities.routes.js'
import ProductRouter from './products/products.routes.js';
import AccountRouter from './accounts/accounts.routes.js'
import OrderRouter from './orders/orders.routes.js'
import InvoiceRouter from './invoices/invoices.routes.js'
import ReviewRouter from './reviews/review.routes.js'

import { populateUsers, populateProducts } from '../scripts/populateDB.js'

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json())
app.use(cors(options))
app.use(cookieParser())

app.use('/api/users', UserRouter)
app.use('/api/accounts', AccountRouter)
app.use('/api/products', ProductRouter)
app.use('/api/orders', OrderRouter)
app.use('/api/invoices', InvoiceRouter)
app.use('/api/vulnerability-groups', VulnerabilityGroupRouter)
app.use('/api/vulnerabilities', VulnerabilityRouter)
app.use('/api/reviews', ReviewRouter)
app.use(express.static(path.join(__dirname, '../', 'build')));
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(__dirname, '../', 'build', 'index.html'));
});

app.get('/api', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, async () => {
    // Populate the database with some initial data for testing purposes
    execSync("npx prisma migrate dev", {
        stdio: "inherit"
    });

    await populateUsers()
    await populateProducts()

    console.log(`Server listening on http://localhost:${port}`);
});
