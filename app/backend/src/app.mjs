import express from 'express'
import dotenv from 'dotenv'
import prisma from './config/db.js'
import cors from 'cors'
import options from './cors_options.js'
import cookieParser from 'cookie-parser'

import UserRouter from './users/users.routes.js'
import VulnerabilityGroupRouter from './vulnerabilityGroups/vulnerabilityGroups.routes.js'
import VulnerabilityRouter from './vulnerabilities/vulnerabilities.routes.js'
import ProductRouter from './products/products.routes.js';
import OrderRouter from './orders/orders.routes.js'
import InvoiceRouter from './invoices/invoices.routes.js'
import ReviewRouter from './reviews/review.routes.js'

import { populateUsersAndProducts, populateOrdersForUser } from '../scripts/populateDB.js'

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(cors(options))
app.use(cookieParser())

app.use('/users', UserRouter)
app.use('/products', ProductRouter)
app.use('/orders', OrderRouter)
app.use('/invoices', InvoiceRouter)
app.use('/vulnerability-groups', VulnerabilityGroupRouter)
app.use('/vulnerabilities', VulnerabilityRouter)
app.use('/reviews', ReviewRouter)

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Temporary route to verify the orders can automatically be created for a user. 
// This function (populateOrdersForUser) is intended to be used with user registration
app.get('/db-test', async (req, res) => {
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
  await populateUsersAndProducts()

  console.log(`Server listening on http://localhost:${port}`);
});
