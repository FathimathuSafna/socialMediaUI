import { io } from 'socket.io-client';

const token = localStorage.getItem('token');

console.log('Socket connecting to:', import.meta.env.VITE_API_URL);

export const socket = io(import.meta.env.VITE_API_URL , {
  withCredentials: true,
  auth: { token: token },
});