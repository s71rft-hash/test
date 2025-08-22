const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('@/utils/ApiError');
const { tokenService } = require('@/services');
const { UserRealmRole, Role } = require('@/models');

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;

  const token = req.headers.authorization.split(' ')[1];
  const tokenVerified = await tokenService.verifyToken(token, 'access');
  if (!tokenVerified) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Token not found'));
  }

  if (requiredRights.length) {
    const userRealmRoles = await UserRealmRole.findAll({
      where: { userId: user.id },
      include: [{ model: Role, attributes: ['name'] }],
    });
    const userRights = userRealmRoles.map((userRealmRole) => userRealmRole.Role.name);
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));

    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};

const auth = (...requiredRights) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth;
