const { getIO } = require('@/socket');

const emitEvent = (eventName, data) => {
  const io = getIO();
  io.emit(eventName, data);
};

module.exports = {
  emitEvent,
};
