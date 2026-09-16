import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config/api';

let socketInstance = null;

export const getSocket = (token) => {
  if (!token) {
    return null;
  }

  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket'],
      auth: {
        token,
      },
    });
  }

  if (!socketInstance.connected) {
    socketInstance.connect();
  }

  return socketInstance;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

export default {
  getSocket,
  disconnectSocket,
};
