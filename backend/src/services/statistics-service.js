const { ROLES } = require('../config/roles');
const { HttpError } = require('../http-error');

function assertCanReadStatistics(actor) {
  if (actor.role === ROLES.ADMIN) {
    return;
  }

  throw new HttpError(403, 'forbidden', 'You are not allowed to access statistics');
}

class StatisticsService {
  constructor({ orderRepository, userRepository }) {
    this.orderRepository = orderRepository;
    this.userRepository = userRepository;
  }

  async getOverview(actor) {
    assertCanReadStatistics(actor);

    const [orderStats, users] = await Promise.all([
      this.orderRepository.getOverviewStats(),
      this.userRepository.listAll(),
    ]);

    const usersByRole = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    return {
      ...orderStats,
      usersByRole,
      totalUsers: users.length,
    };
  }
}

module.exports = {
  StatisticsService,
};
