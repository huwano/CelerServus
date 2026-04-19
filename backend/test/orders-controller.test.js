const test = require('node:test');
const assert = require('node:assert/strict');

const { ROLES } = require('../src/config/roles');
const { ITEM_CATEGORIES } = require('../src/domain/orders');
const { createOrdersController } = require('../src/controllers/orders-controller');
const { InMemoryOrderRepository } = require('../src/repositories/in-memory-order-repository');
const { OrderService } = require('../src/services/order-service');
const { createMockResponse, createNextCollector } = require('./helpers/mock-http');

function createOrdersControllerWithService(orderEvents = { publishOrderChanged() {} }) {
  const service = new OrderService({ orderRepository: new InMemoryOrderRepository() });
  return createOrdersController({ orderService: service, orderEvents });
}

test('createOrder responds with 201 and wraps the order in a data envelope', async () => {
  const controller = createOrdersControllerWithService();
  const req = {
    user: { id: 'waiter-1', role: ROLES.BEDIENUNG },
    body: {
      tableNumber: '11',
      initialNote: 'Geburtstag',
      items: [{ name: 'Apfelschorle', quantity: 1, category: ITEM_CATEGORIES.DRINK }],
    },
  };
  const res = createMockResponse();
  const { calls, next } = createNextCollector();

  await controller.createOrder(req, res, next);

  assert.equal(calls.length, 0);
  assert.equal(res.statusCode, 201);
  assert.equal(res.body.data.tableNumber, '11');
  assert.equal(Array.isArray(res.body.data.items), true);
});

test('listOrders responds with 200 and a plural data payload', async () => {
  const controller = createOrdersControllerWithService();
  const createReq = {
    user: { id: 'waiter-1', role: ROLES.BEDIENUNG },
    body: {
      tableNumber: '15',
      items: [{ name: 'Wasser', quantity: 2, category: ITEM_CATEGORIES.DRINK }],
    },
  };
  const createRes = createMockResponse();
  await controller.createOrder(createReq, createRes, () => {});

  const req = { user: { id: 'waiter-1', role: ROLES.BEDIENUNG } };
  const res = createMockResponse();
  const { calls, next } = createNextCollector();

  await controller.listOrders(req, res, next);

  assert.equal(calls.length, 0);
  assert.equal(res.statusCode, 200);
  assert.equal(Array.isArray(res.body.data), true);
  assert.equal(res.body.data.length, 1);
});

test('createOrder forwards validation errors to next', async () => {
  const controller = createOrdersControllerWithService();
  const req = {
    user: { id: 'waiter-1', role: ROLES.BEDIENUNG },
    body: {
      tableNumber: '11',
      items: [],
    },
  };
  const res = createMockResponse();
  const { calls, next } = createNextCollector();

  await controller.createOrder(req, res, next);

  assert.equal(calls.length, 1);
  assert.equal(calls[0].statusCode, 400);
  assert.equal(calls[0].code, 'validation_error');
});

test('createOrder publishes an order change event after success', async () => {
  const publishedChanges = [];
  const controller = createOrdersControllerWithService({
    publishOrderChanged(change) {
      publishedChanges.push(change);
    },
  });
  const req = {
    user: { id: 'waiter-1', role: ROLES.BEDIENUNG },
    body: {
      tableNumber: '11',
      items: [{ name: 'Apfelschorle', quantity: 1, category: ITEM_CATEGORIES.DRINK }],
    },
  };
  const res = createMockResponse();

  await controller.createOrder(req, res, () => {});

  assert.equal(publishedChanges.length, 1);
  assert.equal(publishedChanges[0].type, 'order_created');
  assert.match(publishedChanges[0].orderId, /^order-/);
});
