const test = require('node:test');
const assert = require('node:assert/strict');

const { ROLES } = require('../src/config/roles');
const { InMemoryOrderRepository } = require('../src/repositories/in-memory-order-repository');
const { InMemoryUserRepository } = require('../src/repositories/in-memory-user-repository');
const { StatisticsService } = require('../src/services/statistics-service');

test('statistics overview aggregates orders and users for admin', async () => {
  const orderRepository = new InMemoryOrderRepository([
    {
      id: 'order-1',
      tableNumber: '7',
      createdByUserId: 'user-1',
      createdAt: '2026-04-16T10:00:00.000Z',
      status: 'open',
      initialNote: '',
      items: [
        {
          id: 'item-1',
          name: 'Wasser',
          quantity: 2,
          category: 'drink',
          station: 'theke',
          status: 'new',
        },
      ],
      messages: [{ id: 'message-1' }],
    },
  ]);

  const userRepository = new InMemoryUserRepository();
  const service = new StatisticsService({ orderRepository, userRepository });

  const overview = await service.getOverview({ id: 'user-4', role: ROLES.ADMIN });

  assert.equal(overview.ordersByStatus.open, 1);
  assert.equal(overview.itemsByCategory.drink.quantityTotal, 2);
  assert.equal(overview.totalMessages, 1);
  assert.equal(overview.totalUsers >= 1, true);
});

test('statistics overview rejects non-admin users', async () => {
  const service = new StatisticsService({
    orderRepository: new InMemoryOrderRepository(),
    userRepository: new InMemoryUserRepository(),
  });

  await assert.rejects(
    () => service.getOverview({ id: 'user-1', role: ROLES.BEDIENUNG }),
    /not allowed to access statistics/,
  );
});
