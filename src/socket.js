import { io } from 'socket.io-client';


const URL = import.meta.env.VITE_API_URL;

const token = localStorage.getItem('token');


export const socket = io(URL, {
  auth: {
    token: token
  }
});