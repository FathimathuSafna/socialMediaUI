import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || "https://socialmediabackend-tdqo.onrender.com";

console.log('Socket connecting to:', SOCKET_URL);

export const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,
  auth: (cb) => {
    cb({ token: localStorage.getItem('token') });
  }
});