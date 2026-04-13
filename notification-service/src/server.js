import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import amqplib from 'amqplib';
import cors from 'cors';
import dotenv from 'dotenv';
import { startMessageConsumer }    from './consumers/messageConsumer.js';
import { startConnectionConsumer } from './consumers/connectionConsumer.js';
import { startEventConsumer }      from './consumers/eventConsumer.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:3000', methods: ['GET','POST'] }
});

io.on('connection', (socket) => {
  socket.on('register', (userId) => {
    socket.join(userId);
    console.log(`[Notification] User ${userId} registered for notifications`);
  });
  socket.on('disconnect', () => console.log('Notification socket disconnected'));
});

app.get('/health', (_, res) => res.json({ status: 'notification-service OK' }));

const start = async () => {
  try {
    const conn    = await amqplib.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    const channel = await conn.createChannel();
    await channel.assertExchange('alumni_events', 'topic', { durable: true });

    // Start all three consumers
    await startMessageConsumer(io, channel);
    await startConnectionConsumer(io, channel);
    await startEventConsumer(io, channel);
    console.log('RabbitMQ consumers started');
  } catch (err) {
    console.warn('⚠️ RabbitMQ not available (notification-service):', err.message);
    console.warn('⚠️ Notification consumers disabled');
  }

  httpServer.listen(process.env.PORT || 5006, () =>
    console.log(`Notification service on port ${process.env.PORT || 5006}`)
  );
};
start();