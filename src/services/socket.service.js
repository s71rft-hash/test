const { getSocketManager } = require('@/socket-instance');

const emitToUser = (userId, event, data) => {
  const socketManager = getSocketManager();
  socketManager.emitToUser({ userId, event, data });
};

const emitToSocketId = (socketId, event, data) => {
  const socketManager = getSocketManager();
  socketManager.emitToSocketId({ socketId, event, data });
};

const emitToAll = (event, data) => {
  const socketManager = getSocketManager();
  socketManager.emitToAll({ event, data });
};

module.exports = {
  emitToUser,
  emitToSocketId,
  emitToAll,
};
