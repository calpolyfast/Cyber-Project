import express from 'express';
const app = express();
const port = process.env.PORT || 3000;

// It's that easy!
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Port 80 is used for HTTP, port 443 is used for HTTPS
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});