const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const config = require('@/config/config');
const userService = require('./services/user.service');
const SocketManager = require('./services/SocketManager');
const { setIO, setSocketManager } = require('./socket-instance');
const ApiError = require('@/utils/ApiError');
const httpStatus = require('http-status');

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: config.env === 'development' ? '*' : 'https://yourapp.com', // TODO: Update with your production domain
    },
  });

  setIO(io);
  const socketManager = new SocketManager();
  setSocketManager(socketManager);

  // Authentication middleware
  io.use(async (socket, next) => {
    const { token } = socket.handshake.auth;
    if (!token) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }
    try {
      const payload = jwt.verify(token, config.jwt.secret);
      if (payload.type !== 'access') {
        throw new Error('Invalid token type');
      }
      const user = await userService.getUserById(payload.sub);
      if (!user) {
        return next(new ApiError(httpStatus.UNAUTHORIZED, 'User not found'));
      }
      socket.user = user;
      next();
    } catch (error) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }
  });

  io.on('connection', (socket) => {
    socketManager.addUser(socket);

    socket.on('disconnect', () => {
      socketManager.removeUser(socket);
    });
  });

  return io;
};

module.exports = {
  initSocket,
};
