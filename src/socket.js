import { io } from 'socket.io-client';

const token = localStorage.getItem('token');


export const socket = io("https://api-appmosphere.safna.online", {
  withCredentials: true,
  auth: { token: token },
});