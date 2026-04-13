import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { connectBroker } from './events/publisher.js';
import connectionRoutes from './routes/connectionRoutes.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/connections', connectionRoutes);
app.get('/health', (_, res) => res.json({ status: 'connection-service OK' }));

const start = async () => {
  await connectDB();
  await connectBroker();
  app.listen(process.env.PORT || 5003, () =>
    console.log(`Connection service on port ${process.env.PORT || 5003}`)
  );
};
start();