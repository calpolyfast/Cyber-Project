import express from 'express'
import dotenv from 'dotenv'
import prisma from './config/db.js'

import UserRouter from './users/users.routes.js'
import VulnerabilityGroupRouter from './vulnerabilityGroups/vulnerabilityGroups.routes.js'
import VulnerabilityRouter from './vulnerabilities/vulnerabilities.routes.js'

dotenv.config()

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())

app.use('/users', UserRouter)
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