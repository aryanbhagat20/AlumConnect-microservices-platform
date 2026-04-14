import jwt from 'jsonwebtoken';
import { Message } from '../models/Message.js';
import { publishEvent } from '../events/publisher.js';

// Track online users: userId -> socketId
const onlineUsers = new Map();

export const initSocket = (io) => {

  // Authenticate socket connection using JWT
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('No token provided'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    console.log(`Connected: ${userId}`);

    // Track online status
    onlineUsers.set(userId, socket.id);
    socket.join(userId); // personal room

    // Send this user the full list of who's already online
    socket.emit('users:online', Array.from(onlineUsers.keys()));

    // Tell everyone this user is online
    io.emit('user:online', { userId, online: true });

    // ── Send Message ────────────────────────────────────────
    socket.on('message:send', async ({ receiverId, content }) => {
      try {
        if (!receiverId || !content?.trim()) return;

        const message = await Message.create({
          sender: userId,
          receiver: receiverId,
          content: content.trim(),
        });

        // Fetch user details from user-service (can't use .populate() across DBs)
        const USER_SERVICE = process.env.USER_SERVICE_URL || 'http://localhost:5002';
        let senderInfo = { _id: userId, name: 'Unknown' };
        let receiverInfo = { _id: receiverId, name: 'Unknown' };
        try {
          const [senderRes, receiverRes] = await Promise.all([
            fetch(`${USER_SERVICE}/users/${userId}`),
            fetch(`${USER_SERVICE}/users/${receiverId}`),
          ]);
          if (senderRes.ok) {
            const sData = await senderRes.json();
            senderInfo = { _id: userId, name: sData.user?.name, profilePicture: sData.user?.profilePicture };
          }
          if (receiverRes.ok) {
            const rData = await receiverRes.json();
            receiverInfo = { _id: receiverId, name: rData.user?.name, profilePicture: rData.user?.profilePicture };
          }
        } catch (e) {
          console.error('Failed to fetch user details:', e.message);
        }

        const populated = {
          _id: message._id,
          content: message.content,
          sender: senderInfo,
          receiver: receiverInfo,
          createdAt: message.createdAt,
          isRead: message.isRead,
        };

        // Deliver to both sender and receiver
        io.to(userId).emit('message:received', populated);
        io.to(receiverId).emit('message:received', populated);

        // Publish to RabbitMQ for notification-service
        await publishEvent('message.sent', {
          senderId: userId,
          receiverId,
          content: message.content,
          messageId: message._id,
          createdAt: message.createdAt,
        });

      } catch (err) {
        console.error('Send message error:', err);
      }
    });

    // ── Typing Indicator ────────────────────────────────────
    socket.on('typing', ({ receiverId, isTyping }) => {
      io.to(receiverId).emit('typing', { senderId: userId, isTyping });
    });

    // ── Disconnect ──────────────────────────────────────────
    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      io.emit('user:online', { userId, online: false });
      console.log(` Disconnected: ${userId}`);
    });
  });
};