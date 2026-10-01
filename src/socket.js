import { io } from 'socket.io-client';

const token = localStorage.getItem('token');

const SOCKET_URL = import.meta.env.VITE_API_URL || "https://socialmediabackend-tdqo.onrender.com";

console.log('Socket connecting to:', SOCKET_URL);

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  auth: { token: token },
});