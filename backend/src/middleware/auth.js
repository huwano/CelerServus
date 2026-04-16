const { normalizeRole } = require('../config/roles');
const { HttpError } = require('../http-error');

function requireAuthenticatedUser(req, _res, next) {
  if (!req.session?.user) {
    return next(new HttpError(401, 'unauthorized', 'Authentication required'));
  }

  req.user = {
    ...req.session.user,
    role: normalizeRole(req.session.user.role),
  };

  return next();
}

module.exports = {
  requireAuthenticatedUser,
};
