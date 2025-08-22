const { User, UserRealmRole, Realm, Role } = require('@/models');
const { Op } = require('sequelize');
const httpStatus = require('http-status');
const ApiError = require('@/utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const { roles, ...userData } = userBody;
  const user = await User.create(userData);
  if (roles && roles.length > 0) {
    const userRealmRoles = roles.map((role) => ({
      userId: user.id,
      realmId: role.realmId,
      roleId: role.roleId,
    }));
    await UserRealmRole.bulkCreate(userRealmRoles);
  }
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
    include: [
      {
        model: UserRealmRole,
        include: [
          { model: Realm, attributes: ['id', 'name'] },
          { model: Role, attributes: ['id', 'name'] },
        ],
      },
    ],
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
  return User.findByPk(id, {
    include: [
      {
        model: UserRealmRole,
        include: [
          { model: Realm, attributes: ['id', 'name'] },
          { model: Role, attributes: ['id', 'name'] },
        ],
      },
    ],
  });
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
  const { roles, ...userData } = updateBody;
  Object.assign(user, userData);
  await user.save();

  if (roles) {
    await UserRealmRole.destroy({ where: { userId } });
    if (roles.length > 0) {
      const userRealmRoles = roles.map((role) => ({
        userId: user.id,
        realmId: role.realmId,
        roleId: role.roleId,
      }));
      await UserRealmRole.bulkCreate(userRealmRoles);
    }
  }

  return getUserById(userId);
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
