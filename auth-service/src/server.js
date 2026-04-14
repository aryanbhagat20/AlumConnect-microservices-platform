import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use('/auth', authRoutes);

app.get('/health', (_, res) => res.json({ status: 'auth-service OK' }));

connectDB().then(() => {
  app.listen(process.env.PORT || 5001, () =>
    console.log(`Auth service running on port ${process.env.PORT || 5001}`)
  );
});