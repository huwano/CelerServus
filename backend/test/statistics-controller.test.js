const test = require('node:test');
const assert = require('node:assert/strict');

const { ROLES } = require('../src/config/roles');
const { createStatisticsController } = require('../src/controllers/statistics-controller');
const { InMemoryOrderRepository } = require('../src/repositories/in-memory-order-repository');
const { InMemoryUserRepository } = require('../src/repositories/in-memory-user-repository');
const { StatisticsService } = require('../src/services/statistics-service');
const { createMockResponse, createNextCollector } = require('./helpers/mock-http');

test('statistics controller responds with overview data for admin', async () => {
  const service = new StatisticsService({
    orderRepository: new InMemoryOrderRepository(),
    userRepository: new InMemoryUserRepository(),
  });
  const controller = createStatisticsController({ statisticsService: service });
  const req = {
    user: { id: 'user-4', role: ROLES.ADMIN },
  };
  const res = createMockResponse();
  const { calls, next } = createNextCollector();

  await controller.getOverview(req, res, next);

  assert.equal(calls.length, 0);
  assert.equal(typeof res.body.data.totalUsers, 'number');
});
