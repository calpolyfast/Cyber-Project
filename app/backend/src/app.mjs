import express from 'express'
import dotenv from 'dotenv'
import prisma from './config/db.js'
<<<<<<< HEAD

import VulnerabilityGroupRouter from './vulnerabilityGroups/vulnerabilityGroups.routes.js'
import VulnerabilityRouter from './vulnerabilities/vulnerabilities.routes.js'
import ProductRouter from '../products/products.routes.js';

dotenv.config()
=======
import cors from 'cors'
import options from './cors_options.js'

import UserRouter from './users/users.routes.js'
import VulnerabilityGroupRouter from './vulnerabilityGroups/vulnerabilityGroups.routes.js'
import VulnerabilityRouter from './vulnerabilities/vulnerabilities.routes.js'
import ProductRouter from './products/products.routes.js';

dotenv.config();
>>>>>>> b2dd9d5e86cbfd583cdfb72d662000192ff3cbbf

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
<<<<<<< HEAD

=======
app.use(cors(options))

app.use('/users', UserRouter)
>>>>>>> b2dd9d5e86cbfd583cdfb72d662000192ff3cbbf
app.use('/products', ProductRouter)
app.use('/vulnerability-groups', VulnerabilityGroupRouter)
app.use('/vulnerabilities', VulnerabilityRouter)

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/db-test', async (req, res) => {
  try {
    const users = await prisma.user.findMany()
    res.json(users)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
