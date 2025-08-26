let io;
let socketManager;

const setIO = (ioInstance) => {
  io = ioInstance;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized!');
  }
  return io;
};

const setSocketManager = (socketManagerInstance) => {
  socketManager = socketManagerInstance;
};

const getSocketManager = () => {
  if (!socketManager) {
    throw new Error('SocketManager not initialized!');
  }
  return socketManager;
};

module.exports = {
  setIO,
  getIO,
  setSocketManager,
  getSocketManager,
};
