import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { verifyToken } from './middleware/authMiddleware.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));


const SERVICES = {
  AUTH:       process.env.AUTH_SERVICE_URL       || 'http://localhost:5001',
  USER:       process.env.USER_SERVICE_URL       || 'http://localhost:5002',
  CONNECTION: process.env.CONNECTION_SERVICE_URL || 'http://localhost:5003',
  CHAT:       process.env.CHAT_SERVICE_URL       || 'http://localhost:5004',
  EVENT:      process.env.EVENT_SERVICE_URL      || 'http://localhost:5005',
};

// Public routes — no JWT needed
app.use('/api/auth', createProxyMiddleware({ target: SERVICES.AUTH, changeOrigin: true,
  pathRewrite: { '^/': '/auth/' } }));

// Protected routes — JWT verified at gateway
app.use('/api/users',       verifyToken, createProxyMiddleware({ target: SERVICES.USER,       changeOrigin: true, pathRewrite: { '^/': '/users/' } }));
app.use('/api/connections', verifyToken, createProxyMiddleware({ target: SERVICES.CONNECTION, changeOrigin: true, pathRewrite: { '^/': '/connections/' } }));
app.use('/api/messages',    verifyToken, createProxyMiddleware({ target: SERVICES.CHAT,       changeOrigin: true, pathRewrite: { '^/': '/messages/' } }));
app.use('/api/events',      verifyToken, createProxyMiddleware({ target: SERVICES.EVENT,      changeOrigin: true, pathRewrite: { '^/': '/events/' } }));

app.get('/health', (_, res) => res.json({ gateway: 'OK' }));

app.listen(process.env.PORT || 5000, () =>
  console.log(`API Gateway running on port ${process.env.PORT || 5000}`)
);