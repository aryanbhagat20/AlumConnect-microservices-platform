

import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

export const useSocket = () => {
  const { user, isAuthenticated, loading } = useAuth();

  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [isConnected, setIsConnected] = useState(false);

  const socketRef = useRef(null);

  useEffect(() => {
    // 🟡 Wait until auth is ready
    if (loading) {
      console.log('⏳ Auth loading...');
      return;
    }

    // 🔴 Skip if not authenticated
    if (!isAuthenticated || !user) {
      console.log('⏸️ Socket: Not authenticated, skipping connection');
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      console.log('⏸️ Socket: No token found');
      return;
    }

    console.log('🔌 Socket: Connecting to server...');
    console.log('👤 User ID:', user._id);

    // 🔥 Create socket
    const newSocket = io('http://localhost:5004', {
      auth: { token },
      transports: ['websocket'], // more stable
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // ✅ CONNECT
    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setIsConnected(true);
    });

    // ❌ ERROR
    newSocket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error.message);
      setIsConnected(false);
    });

    // ⚠️ DISCONNECT
    newSocket.on('disconnect', (reason) => {
      console.log('⚠️ Disconnected:', reason);
      setIsConnected(false);
    });

    // 👤 ONLINE USERS
    newSocket.off('user:online');
    newSocket.on('user:online', ({ userId, online }) => {
      console.log('👤 User', userId, online ? 'online' : 'offline');

      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        if (online) updated.add(userId);
        else updated.delete(userId);
        return updated;
      });
    });

    // 📨 MESSAGE RECEIVED
    newSocket.off('message:received');
    newSocket.on('message:received', (message) => {
      console.log('📨 Message received:', message);
    });

    // Save socket
    socketRef.current = newSocket;
    setSocket(newSocket);

    // 🧹 CLEANUP
    return () => {
      console.log('🔌 Cleaning socket...');
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setIsConnected(false);
    };
  }, [user, isAuthenticated, loading]); // ✅ include loading

  // 📤 SEND MESSAGE
  const sendMessage = (receiverId, content) => {
    console.log('📤 Sending message...');

    if (!socketRef.current) {
      console.error('❌ Socket not initialized');
      return false;
    }

    if (!socketRef.current.connected) {
      console.error('❌ Socket not connected');
      return false;
    }

    if (!content?.trim()) {
      console.error('❌ Empty message');
      return false;
    }

    socketRef.current.emit('message:send', { receiverId, content });
    console.log('✅ Message sent');

    return true;
  };

  // ✍️ TYPING INDICATOR
  const sendTyping = (receiverId, isTyping) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('typing', { receiverId, isTyping });
    }
  };

  // 📨 LISTEN FOR MESSAGES (CUSTOM HANDLER)
const onMessageReceived = (callback) => {
  if (!socketRef.current) return () => {};

  const socket = socketRef.current;

  socket.on('message:received', callback);

  return () => {
    if (socket) {
      socket.off('message:received', callback); // ✅ only remove THIS listener
    }
  };
};

  return {
    socket,
    onlineUsers,
    isConnected,
    sendMessage,
    sendTyping,
    onMessageReceived,
    isUserOnline: (userId) => onlineUsers.has(userId),
  };
};