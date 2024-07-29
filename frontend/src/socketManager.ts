import { io, Socket } from 'socket.io-client';

class SocketManager {
  private static instance: Socket;
  private constructor() {}

  public static getInstance(): Socket {
    if (!SocketManager.instance) {
      SocketManager.instance = io("http://localhost:5000");
    }
    return SocketManager.instance;
  }
}

export default SocketManager;