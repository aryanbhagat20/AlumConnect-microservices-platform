import redisClient, { getRedisStatus } from './redisClient.js';

const TTL = 120; // 2 minutes for chat history

export const getChatCache = async (key) => {
  if (!getRedisStatus()) return null;
  try {
    const data = await redisClient.get(`chat:${key}`);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
};

export const setChatCache = async (key, messages) => {
  if (!getRedisStatus()) return;
  try {
    await redisClient.setEx(`chat:${key}`, TTL, JSON.stringify(messages));
  } catch {}
};

export const invalidateChatCache = async (key) => {
  if (!getRedisStatus()) return;
  try {
    await redisClient.del(`chat:${key}`);
  } catch {}
};