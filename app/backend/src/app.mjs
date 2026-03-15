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
import OrderRouter from './orders/orders.routes.js'

import { populateUsersAndProducts, populateOrdersForUser } from '../scripts/populateDB.js'

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json())
app.use(cors(options))
app.use(cookieParser())

app.use('/api/users', UserRouter)
app.use('/api/products', ProductRouter)
app.use('/api/orders', OrderRouter)
app.use('/api/vulnerability-groups', VulnerabilityGroupRouter)
app.use('/api/vulnerabilities', VulnerabilityRouter)
app.use(express.static(path.join(__dirname, '../', 'build')));
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(__dirname, '../', 'build', 'index.html'));
});

app.get('/api', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/db-test', async (req, res) => {
  try {
    const users = await prisma.user.findMany()
    if (users.length > 0) {
      populateOrdersForUser(users[0].id)
      console.log(`Created orders for user ${users[0].username}`)
    }
    res.status(200).json({ message: "Database connection successful", users })
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.listen(port, async () => {
  // Populate the database with some initial data for testing purposes
    execSync("npx prisma migrate dev", {
        stdio: "inherit"
    });
    await populateUsersAndProducts()

    console.log(`Server listening on http://localhost:${port}`);
});
