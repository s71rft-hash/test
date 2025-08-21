const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const config = require('@/config/config');
const userService = require('./services/user.service');
const ApiError = require('@/utils/ApiError');
const httpStatus = require('http-status');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*', // For development. In production, this should be restricted.
    },
  });

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
    // console.log('A user connected:', socket.user.name);

    socket.on('disconnect', () => {
      // console.log('User disconnected:', socket.user.name);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized!');
  }
  return io;
};

module.exports = {
  initSocket,
  getIO,
};
