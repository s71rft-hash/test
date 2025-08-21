const httpStatus = require('http-status');
const catchAsync = require('@/utils/catchAsync');
const { sessionService } = require('@/services');

const getActiveSessions = catchAsync(async (req, res) => {
  const sessions = await sessionService.getAllActiveSessions();
  res.send(sessions);
});

const terminateSession = catchAsync(async (req, res) => {
  await sessionService.terminateSession(req.params.token);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getActiveSessions,
  terminateSession,
};
