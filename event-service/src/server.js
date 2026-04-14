import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { connectBroker } from './events/publisher.js';
import eventRoutes from './routes/eventRoutes.js';
dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use('/events', eventRoutes);
app.get('/health', (_, res) => res.json({ status: 'event-service OK' }));

const start = async () => {
  await connectDB();
  await connectBroker();
  app.listen(process.env.PORT || 5005, () =>
    console.log(`Event service on port ${process.env.PORT || 5005}`)
  );
};
start();