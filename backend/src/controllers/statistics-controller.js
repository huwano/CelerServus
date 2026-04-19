function createStatisticsController({ statisticsService }) {
  return {
    async getOverview(req, res, next) {
      try {
        const overview = await statisticsService.getOverview(req.user);
        return res.json({ data: overview });
      } catch (error) {
        return next(error);
      }
    },
  };
}

module.exports = {
  createStatisticsController,
};
