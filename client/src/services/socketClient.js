import { io } from 'socket.io-client';

// Dynamically uses VITE_SOCKET_URL from .env, or current domain origin in production
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000
    });

    socket.on('connect', () => {
      console.log('⚡ Connected to JanSetu Realtime WebSocket Server:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.warn('Socket connection retry:', err.message);
    });
  }
  return socket;
};
