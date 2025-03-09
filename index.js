import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

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

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

app.listen(PORT, () => {
  console.log(`Node server is running on port number: ${PORT}`);
});
