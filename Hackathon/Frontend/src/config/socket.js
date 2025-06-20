// src/socket.js
import { io } from 'socket.io-client';
import { hostConfig } from '.';

const socket = io(hostConfig.WEB_URL, {
  transports: ['websocket'],
  autoConnect: false,
});

export default socket;
