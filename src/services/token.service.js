const jwt = require('jsonwebtoken');
const config = require('../config/config');
const redisClient = require('../config/redis');

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: expires,
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @returns {Promise<boolean>}
 */
const saveToken = async (token, userId, expires, type) => {
  const key = `session:${userId}:${type}:${token}`;
  const expirationInSeconds = expires - Math.floor(Date.now() / 1000);
  await redisClient.set(key, 'true', 'EX', expirationInSeconds);
  return true;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<boolean>}
 */
const verifyToken = async (token, type) => {
    const payload = jwt.verify(token, config.jwt.secret);
    const key = `session:${payload.sub}:${type}:${token}`;
    const tokenExists = await redisClient.get(key);
    return !!tokenExists;
};


/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
  const accessTokenExpires = Math.floor(Date.now() / 1000) + config.jwt.accessExpirationMinutes * 60;
  const accessToken = generateToken(user.id, accessTokenExpires, 'access');

  await saveToken(accessToken, user.id, accessTokenExpires, 'access');

  return {
    access: {
      token: accessToken,
      expires: new Date(accessTokenExpires * 1000),
    },
  };
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
};
