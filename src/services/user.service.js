const { User } = require('@/models');
const { Op } = require('sequelize');
const httpStatus = require('http-status');
const ApiError = require('@/utils/ApiError');
const { rabbitmqService } = require('../config/rabbitmq');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const user = await User.create(userBody);
  rabbitmqService.publish('user_events', 'user.created', user);
  return user;
};

/**
 * Query for users
 * @param {Object} filter - Sequelize filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getUsers = async (filter, options) => {
  const { limit, page } = options;
  const offset = (page - 1) * limit;

  const where = {};
  if (filter.name) {
    where.name = { [Op.like]: `%${filter.name}%` };
  }
  if (filter.role) {
    where.role = filter.role;
  }

  const order = [];
  if (options.sortBy) {
    const [field, direction] = options.sortBy.split(':');
    order.push([field, direction.toUpperCase()]);
  }

  const { count, rows } = await User.findAndCountAll({
    where,
    limit,
    offset,
    order,
  });

  return {
    totalResults: count,
    results: rows,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    limit,
  };
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findByPk(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ where: { email } });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.destroy();
  return user;
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
