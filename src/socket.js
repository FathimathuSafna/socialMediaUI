import { io } from 'socket.io-client';

// Your server URL
const URL = "http://localhost:5000";

const token = localStorage.getItem('token');


export const socket = io(URL, {
  auth: {
    token: token
  }
});