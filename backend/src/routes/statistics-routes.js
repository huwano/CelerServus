const express = require('express');
const { requireAuthenticatedUser } = require('../middleware/auth');

function createStatisticsRouter({ statisticsController }) {
  const router = express.Router();

  router.use(requireAuthenticatedUser);
  router.get('/stats/overview', statisticsController.getOverview);

  return router;
}

module.exports = {
  createStatisticsRouter,
};
