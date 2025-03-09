import express from 'express';
import dotenv from 'dotenv';

// Load environment variable from .env file to process.env
dotenv.config();

const app = express();
console.log(process.env);
const PORT = process.env.PORT || 3003;

app.get('/', (req, res) => {
  res.send('Hello Noders');
});

app.get('/nehal', (req, res) => {
  res.send('Route to Nehal');
});

app.get('/panchal', (req, res) => {
  res.send('Route to Panchal');
});

app.listen(PORT, () => {
  console.log(`Node server is running on port number: ${PORT}`);
});
