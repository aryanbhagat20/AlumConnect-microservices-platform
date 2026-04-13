import { createClient } from 'redis';

let client = null;
let isConnected = false;

try {
  client = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
  client.on('error', err => console.error('Redis error:', err.message));
  client.on('connect', () => { isConnected = true; console.log('Redis connected (chat-service)'); });
  client.on('end', () => { isConnected = false; });
  await client.connect();
} catch (err) {
  console.warn('⚠️ Redis not available (chat-service), caching disabled:', err.message);
  isConnected = false;
}

export const getRedisStatus = () => isConnected;
export default client;