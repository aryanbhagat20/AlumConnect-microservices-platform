import redisClient, { getRedisStatus } from './redisClient.js';

const TTL = 300; // 5 minutes

export const getCachedUser = async (userId) => {
  if (!getRedisStatus()) return null;
  try {
    const data = await redisClient.get(`user:${userId}`);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
};

export const setCachedUser = async (userId, userData) => {
  if (!getRedisStatus()) return;
  try {
    await redisClient.setEx(`user:${userId}`, TTL, JSON.stringify(userData));
  } catch {}
};

export const invalidateUser = async (userId) => {
  if (!getRedisStatus()) return;
  try {
    await redisClient.del(`user:${userId}`);
  } catch {}
};