import { Message } from '../models/Message.js';
import { getChatCache, setChatCache } from '../cache/chatCache.js';

export const getConversation = async (req, res) => {
  try {
    const myId    = req.headers['x-user-id'];
    const { userId } = req.params;
    const cacheKey = [myId, userId].sort().join(':');

    const cached = await getChatCache(cacheKey);
    if (cached) return res.json({ success: true, messages: cached, fromCache: true });

    const rawMessages = await Message.find({
      $or: [
        { sender: myId, receiver: userId },
        { sender: userId, receiver: myId },
      ],
    }).sort({ createdAt: 1 });

    // Fetch user details for both participants from user-service
    const USER_SERVICE = process.env.USER_SERVICE_URL || 'http://localhost:5002';
    const userCache = {};
    const fetchUser = async (uid) => {
      if (userCache[uid]) return userCache[uid];
      try {
        const resp = await fetch(`${USER_SERVICE}/users/${uid}`);
        if (resp.ok) {
          const data = await resp.json();
          userCache[uid] = { _id: uid, name: data.user?.name, profilePicture: data.user?.profilePicture };
        } else {
          userCache[uid] = { _id: uid, name: 'Unknown' };
        }
      } catch {
        userCache[uid] = { _id: uid, name: 'Unknown' };
      }
      return userCache[uid];
    };

    // Pre-fetch both users
    await Promise.all([fetchUser(myId), fetchUser(userId)]);

    // Enrich messages with user objects
    const messages = rawMessages.map(msg => ({
      _id: msg._id,
      content: msg.content,
      sender: userCache[msg.sender.toString()] || { _id: msg.sender.toString() },
      receiver: userCache[msg.receiver.toString()] || { _id: msg.receiver.toString() },
      isRead: msg.isRead,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
    }));

    await setChatCache(cacheKey, messages);
    res.json({ success: true, messages });
  } catch (err) {
    console.error(err);
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
    const rawInbox = [];
    for (const msg of messages) {
      const partnerId = msg.sender.toString() === myId
        ? msg.receiver.toString() : msg.sender.toString();
      if (!seen.has(partnerId)) {
        seen.add(partnerId);
        rawInbox.push({
          partnerId,
          lastMessage: msg.content,
          lastMessageAt: msg.createdAt,
          isRead: msg.isRead,
        });
      }
    }

    // Enrich partner info from user-service
    const USER_SERVICE = process.env.USER_SERVICE_URL || 'http://localhost:5002';
    const inbox = await Promise.all(
      rawInbox.map(async (item) => {
        try {
          const resp = await fetch(`${USER_SERVICE}/users/${item.partnerId}`);
          if (resp.ok) {
            const data = await resp.json();
            item.partnerName = data.user?.name || 'Unknown';
            item.partnerPicture = data.user?.profilePicture || '';
          } else {
            item.partnerName = 'Unknown';
          }
        } catch {
          item.partnerName = 'Unknown';
        }
        return item;
      })
    );

    res.json({ success: true, inbox });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};