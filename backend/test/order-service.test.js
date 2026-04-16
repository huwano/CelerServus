const test = require('node:test');
const assert = require('node:assert/strict');

const { ROLES } = require('../src/config/roles');
const {
  ITEM_CATEGORIES,
  MESSAGE_TARGETS,
  ORDER_ITEM_STATUSES,
  STATIONS,
} = require('../src/domain/orders');
const { InMemoryOrderRepository } = require('../src/repositories/in-memory-order-repository');
const { OrderService } = require('../src/services/order-service');

function createServiceWithSeed() {
  const repository = new InMemoryOrderRepository([
    {
      id: 'order-1',
      tableNumber: '7',
      createdByUserId: 'waiter-1',
      createdAt: '2026-04-16T10:00:00.000Z',
      status: 'open',
      initialNote: 'Ohne Eis',
      items: [
        {
          id: 'item-1',
          name: 'Cola',
          quantity: 2,
          category: ITEM_CATEGORIES.DRINK,
          station: STATIONS.THEKE,
          status: ORDER_ITEM_STATUSES.NEW,
        },
        {
          id: 'item-2',
          name: 'Pasta',
          quantity: 1,
          category: ITEM_CATEGORIES.FOOD,
          station: STATIONS.KUECHE,
          status: ORDER_ITEM_STATUSES.NEW,
        },
      ],
      messages: [
        {
          id: 'message-1',
          orderId: 'order-1',
          authorUserId: 'waiter-1',
          message: 'Bitte zuerst die Getraenke',
          targetStations: [STATIONS.THEKE],
          createdAt: '2026-04-16T10:01:00.000Z',
        },
      ],
    },
    {
      id: 'order-2',
      tableNumber: '8',
      createdByUserId: 'waiter-2',
      createdAt: '2026-04-16T10:05:00.000Z',
      status: 'open',
      initialNote: '',
      items: [
        {
          id: 'item-3',
          name: 'Suppe',
          quantity: 1,
          category: ITEM_CATEGORIES.FOOD,
          station: STATIONS.KUECHE,
          status: ORDER_ITEM_STATUSES.NEW,
        },
      ],
      messages: [],
    },
  ]);

  return new OrderService({ orderRepository: repository });
}

test('bedienung only sees own orders', () => {
  const service = createServiceWithSeed();
  const actor = { id: 'waiter-1', role: ROLES.BEDIENUNG };

  const orders = service.listOrders(actor);

  assert.equal(orders.length, 1);
  assert.equal(orders[0].id, 'order-1');
});

test('theke sees only drink items and relevant messages', () => {
  const service = createServiceWithSeed();
  const actor = { id: 'station-1', role: ROLES.THEKE };

  const order = service.getOrder(actor, 'order-1');

  assert.deepEqual(order.items.map((item) => item.id), ['item-1']);
  assert.deepEqual(order.messages.map((message) => message.id), ['message-1']);
});

test('admin sees all orders without filtering', () => {
  const service = createServiceWithSeed();
  const actor = { id: 'admin-1', role: ROLES.ADMIN };

  const orders = service.listOrders(actor);

  assert.equal(orders.length, 2);
  assert.equal(orders[0].items.length, 2);
});

test('only the matching station can update an item status', () => {
  const service = createServiceWithSeed();

  assert.throws(
    () =>
      service.updateOrderItemStatus(
        { id: 'station-1', role: ROLES.THEKE },
        'order-1',
        'item-2',
        { status: ORDER_ITEM_STATUSES.IN_PROGRESS },
      ),
    /not allowed to update this item/,
  );
});

test('bedienung can add a station-specific message', () => {
  const service = createServiceWithSeed();

  const message = service.addMessage(
    { id: 'waiter-1', role: ROLES.BEDIENUNG },
    'order-1',
    {
      message: 'Ist der Burger gleich fertig?',
      targetStations: MESSAGE_TARGETS.KUECHE,
    },
  );

  assert.equal(message.targetStations[0], STATIONS.KUECHE);
  assert.equal(message.message, 'Ist der Burger gleich fertig?');
});

test('createOrder rejects empty items as validation errors', () => {
  const service = createServiceWithSeed();

  assert.throws(
    () =>
      service.createOrder(
        { id: 'waiter-1', role: ROLES.BEDIENUNG },
        {
          tableNumber: '11',
          items: [],
        },
      ),
    (error) =>
      error.statusCode === 400 &&
      error.code === 'validation_error' &&
      error.details?.field === 'items',
  );
});

test('addMessage rejects empty message payloads as validation errors', () => {
  const service = createServiceWithSeed();

  assert.throws(
    () =>
      service.addMessage(
        { id: 'waiter-1', role: ROLES.BEDIENUNG },
        'order-1',
        {
          message: '   ',
          targetStations: MESSAGE_TARGETS.KUECHE,
        },
      ),
    (error) =>
      error.statusCode === 400 &&
      error.code === 'validation_error' &&
      error.details?.field === 'message',
  );
});

test('updateOrderItemStatus rejects missing status payloads as validation errors', () => {
  const service = createServiceWithSeed();

  assert.throws(
    () =>
      service.updateOrderItemStatus(
        { id: 'station-1', role: ROLES.THEKE },
        'order-1',
        'item-1',
        {},
      ),
    (error) =>
      error.statusCode === 400 &&
      error.code === 'validation_error' &&
      error.details?.field === 'status',
  );
});
