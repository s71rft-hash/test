const httpStatus = require('http-status');
const pick = require('@/utils/pick');
const ApiError = require('@/utils/ApiError');
const catchAsync = require('@/utils/catchAsync');
const { userService, socketService } = require('@/services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  socketService.emitEvent('user:created', user);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.limit = options.limit ? parseInt(options.limit, 10) : 10;
  options.page = options.page ? parseInt(options.page, 10) : 1;
  const result = await userService.getUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
