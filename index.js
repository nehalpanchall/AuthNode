import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { dbConnect } from './utils/dbConnection.js';
import userRoute from './routes/user.routes.js';

// Load environment variable from .env file to process.env
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3003;

app.get('/', (req, res) => {
  res.send('Hello Noders');
});

app.use('/api/v1/users/', userRoute);

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

// Database connection
await dbConnect();

app.listen(PORT, () => {
  console.log(`Node server is running on port number: ${PORT}`);
});
