import express from 'express'
import dotenv from 'dotenv'
import prisma from './config/db.js'

dotenv.config()

const app = express();
const port = process.env.PORT || 3000;

// It's that easy!
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

// Port 80 is used for HTTP, port 443 is used for HTTPS
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});