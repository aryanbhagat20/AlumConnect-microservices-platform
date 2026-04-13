import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { connectBroker } from './events/publisher.js';
import { initSocket } from './socket/socketHandler.js';
import messageRoutes from './routes/messageRoutes.js';
dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:3000', methods: ['GET','POST'] }
});

app.use(cors());
app.use(express.json());

app.use('/messages', messageRoutes);
app.get('/health', (_, res) => res.json({ status: 'chat-service OK' }));

initSocket(io);

const start = async () => {
  await connectDB();
  await connectBroker();
  httpServer.listen(process.env.PORT || 5004, () =>
    console.log(`Chat service on port ${process.env.PORT || 5004}`)
  );
};
start();