const { toLegacyRole } = require('../config/roles');

function serializeUser(user, { legacyRole = false } = {}) {
  return {
    ...user,
    role: legacyRole ? toLegacyRole(user.role) : user.role,
  };
}

function createSessionsController({ sessionService }) {
  return {
    createSession(req, res, next) {
      try {
        const user = sessionService.authenticate(req.body);
        req.session.user = user;

        return res.status(201).json({ data: { user } });
      } catch (error) {
        return next(error);
      }
    },

    getCurrentSession(req, res) {
      return res.json({ data: { user: req.user } });
    },

    destroyCurrentSession(req, res) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    },

    createLegacySession(req, res, next) {
      try {
        const user = sessionService.authenticate(req.body);
        req.session.user = user;

        return res.json({ user: serializeUser(user, { legacyRole: true }) });
      } catch (error) {
        return next(error);
      }
    },

    getLegacyCurrentSession(req, res) {
      if (!req.session.user) {
        return res.status(401).json({ user: null });
      }

      return res.json({
        user: serializeUser(req.session.user, { legacyRole: true }),
      });
    },

    destroyLegacySession(req, res) {
      req.session.destroy(() => {
        res.clearCookie('sid');
        res.json({ ok: true });
      });
    },
  };
}

module.exports = {
  createSessionsController,
};
