import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.get('/health', (_, res) => res.json({ status: 'user-service OK' }));

connectDB().then(() => {
  app.listen(process.env.PORT || 5002, () =>
    console.log(`User service on port ${process.env.PORT || 5002}`)
  );
});