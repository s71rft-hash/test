const redisClient = require('@/config/redis');

/**
 * Get all active sessions for a user
 * @param {ObjectId} userId
 * @returns {Promise<string[]>}
 */
const getActiveSessionsForUser = async (userId) => {
  const keys = await redisClient.keys(`session:${userId}:*`);
  return keys;
};

/**
 * Get all active sessions
 * @returns {Promise<string[]>}
 */
const getAllActiveSessions = async () => {
  const keys = await redisClient.keys('session:*');
  return keys;
};

/**
 * Terminate a session
 * @param {string} token
 * @returns {Promise<void>}
 */
const terminateSession = async (token) => {
  const key = `session:*:*:${token}`;
  const keys = await redisClient.keys(key);
  if (keys.length > 0) {
    await redisClient.del(keys[0]);
  }
};

module.exports = {
  getActiveSessionsForUser,
  getAllActiveSessions,
  terminateSession,
};
