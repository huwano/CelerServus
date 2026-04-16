const express = require('express');

const { requireAuthenticatedUser } = require('../middleware/auth');

function createSessionsRouter({ sessionsController }) {
  const router = express.Router();

  router.post('/sessions', sessionsController.createSession);
  router.get('/sessions/me', requireAuthenticatedUser, sessionsController.getCurrentSession);
  router.delete(
    '/sessions/current',
    requireAuthenticatedUser,
    sessionsController.destroyCurrentSession,
  );

  router.get('/api/me', sessionsController.getLegacyCurrentSession);
  router.post('/api/login', sessionsController.createLegacySession);
  router.post('/api/logout', sessionsController.destroyLegacySession);

  return router;
}

module.exports = {
  createSessionsRouter,
};
