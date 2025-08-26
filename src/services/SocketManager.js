const { getIO } = require('@/socket-instance');
const redisClient = require('@/config/redis');

class SocketManager {
  constructor() {
    this.redis = redisClient;
  }

  getKey(userId) {
    return `sockets:${userId}`;
  }

  async addUser(socket) {
    const userId = socket.user.id.toString();
    await this.redis.sadd(this.getKey(userId), socket.id);
    socket.join(userId);
    console.log(`User connected: ${socket.user.name}, socketId: ${socket.id}`);
  }

  async removeUser(socket) {
    const userId = socket.user.id.toString();
    await this.redis.srem(this.getKey(userId), socket.id);
    socket.leave(userId);
    console.log(`User disconnected: ${socket.user.name}, socketId: ${socket.id}`);
  }

  emitToUser({ userId, event, data }) {
    const io = getIO();
    io.to(userId.toString()).emit(event, data);
  }

  emitToSocketId({ socketId, event, data }) {
    const io = getIO();
    io.to(socketId).emit(event, data);
  }

  emitToAll({ event, data }) {
    const io = getIO();
    io.emit(event, data);
  }
}

module.exports = SocketManager;
