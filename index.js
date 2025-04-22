import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { dbConnect } from './utils/dbConnection.js';
import userRoute from './routes/user.routes.js';
import cookieParser from 'cookie-parser';

// Load environment variable from .env file to process.env
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3003;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true, // [credentials: 'include'] in frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

app.get('/', (req, res) => {
  res.send('Hello Noders');
});

app.use('/api/v1/users/', userRoute);

// Database connection
await dbConnect();

app.listen(PORT, () => {
  console.log(`Node server is running on port number: ${PORT}`);
});
