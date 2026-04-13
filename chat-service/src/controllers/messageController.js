import { Message } from '../models/Message.js';
import { publishEvent } from '../events/publisher.js';
import { getChatCache, setChatCache, invalidateChatCache } from '../cache/chatCache.js';

export const getConversation = async (req, res) => {
  try {
    const myId    = req.headers['x-user-id'];
    const { userId } = req.params;
    const cacheKey = [myId, userId].sort().join(':');

    const cached = await getChatCache(cacheKey);
    if (cached) return res.json({ success: true, messages: cached, fromCache: true });

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: userId },
        { sender: userId, receiver: myId },
      ],
    }).sort({ createdAt: 1 });

    await setChatCache(cacheKey, messages);
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

export const getInbox = async (req, res) => {
  try {
    const myId = req.headers['x-user-id'];
    const messages = await Message.find({
      $or: [{ sender: myId }, { receiver: myId }],
    }).sort({ createdAt: -1 });

    const seen = new Set();
    const inbox = [];
    for (const msg of messages) {
      const partnerId = msg.sender.toString() === myId
        ? msg.receiver.toString() : msg.sender.toString();
      if (!seen.has(partnerId)) {
        seen.add(partnerId);
        inbox.push({
          partnerId,
          lastMessage: msg.content,
          lastMessageAt: msg.createdAt,
          isRead: msg.isRead,
        });
      }
    }
    res.json({ success: true, inbox });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Called by Socket.IO handler after saving a message
export const saveAndPublishMessage = async ({ senderId, receiverId, content }) => {
  const message = await Message.create({
    sender: senderId,
    receiver: receiverId,
    content,
  });

  // Invalidate stale cache for this conversation
  const cacheKey = [senderId, receiverId].sort().join(':');
  await invalidateChatCache(cacheKey);

  // Publish to broker — Notification Service picks this up
  await publishEvent('message.sent', {
    messageId:   message._id,
    senderId,
    receiverId,
    content,
    createdAt:   message.createdAt,
  });

  return message;
};