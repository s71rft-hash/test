const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const config = require('@/config/config');
const redisClient = require('@/config/redis');
const userService = require('@/services/user.service');
const tokenService = require('@/services/token.service');
const { User } = require('@/models');
const ApiError = require('@/utils/ApiError');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Logout
 * @param {string} accessToken
 * @returns {Promise}
 */
const logout = async (accessToken) => {
  const payload = jwt.verify(accessToken, config.jwt.secret);
  const key = `session:${payload.sub}:access:${accessToken}`;
  await redisClient.del(key);
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
};
