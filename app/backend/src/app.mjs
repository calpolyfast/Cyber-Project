import express from 'express'
import dotenv from 'dotenv'
import prisma from './config/db.js'
import cors from 'cors'
import options from './cors_options.js'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url';

import UserRouter from './users/users.routes.js'
import VulnerabilityGroupRouter from './vulnerabilityGroups/vulnerabilityGroups.routes.js'
import VulnerabilityRouter from './vulnerabilities/vulnerabilities.routes.js'
import ProductRouter from './products/products.routes.js';
import OrderRouter from './orders/orders.routes.js'

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
    res.json(users)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on http://localhost:${port}`);
});
