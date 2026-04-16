const test = require('node:test');
const assert = require('node:assert/strict');

const { DEFAULT_ORDER_RULES } = require('../src/config/order-rules');
const {
  ITEM_CATEGORIES,
  MESSAGE_TARGETS,
  ORDER_ITEM_STATUSES,
  ORDER_STATUSES,
  STATIONS,
  canEditOrder,
  canStationHandleItem,
  createOrder,
  createOrderMessage,
  deriveOrderStatus,
  getVisibleMessagesForStation,
} = require('../src/domain/orders');

test('createOrder assigns stations from food and drink categories', () => {
  const order = createOrder({
    id: 'order-42',
    tableNumber: '12',
    createdByUserId: 'user-1',
    initialNote: 'Ohne Zwiebeln',
    items: [
      { name: 'Cola', quantity: 2, category: ITEM_CATEGORIES.DRINK },
      { name: 'Burger', quantity: 1, category: ITEM_CATEGORIES.FOOD },
    ],
  });

  assert.equal(order.status, ORDER_STATUSES.OPEN);
  assert.deepEqual(
    order.items.map((item) => item.station),
    [STATIONS.THEKE, STATIONS.KUECHE],
  );
});

test('deriveOrderStatus becomes in_progress when one item has started', () => {
  const status = deriveOrderStatus([
    { status: ORDER_ITEM_STATUSES.NEW },
    { status: ORDER_ITEM_STATUSES.IN_PROGRESS },
  ]);

  assert.equal(status, ORDER_STATUSES.IN_PROGRESS);
});

test('deriveOrderStatus becomes completed when all items are ready or cancelled', () => {
  const status = deriveOrderStatus([
    { status: ORDER_ITEM_STATUSES.READY },
    { status: ORDER_ITEM_STATUSES.CANCELLED },
  ]);

  assert.equal(status, ORDER_STATUSES.COMPLETED);
});

test('messages can target one station or both and remain filtered per station', () => {
  const messages = [
    createOrderMessage({
      id: 'message-1',
      orderId: 'order-1',
      authorUserId: 'waiter-1',
      message: 'Wie lange noch fuer die Getraenke?',
      targetStations: MESSAGE_TARGETS.THEKE,
    }),
    createOrderMessage({
      id: 'message-2',
      orderId: 'order-1',
      authorUserId: 'waiter-1',
      message: 'Tisch 4 hat es eilig',
      targetStations: MESSAGE_TARGETS.BOTH,
    }),
  ];

  assert.deepEqual(
    getVisibleMessagesForStation(messages, STATIONS.THEKE).map((message) => message.id),
    ['message-1', 'message-2'],
  );
  assert.deepEqual(
    getVisibleMessagesForStation(messages, STATIONS.KUECHE).map((message) => message.id),
    ['message-2'],
  );
});

test('station handling is restricted to matching items', () => {
  const drinkItem = { station: STATIONS.THEKE };
  const foodItem = { station: STATIONS.KUECHE };

  assert.equal(canStationHandleItem(STATIONS.THEKE, drinkItem), true);
  assert.equal(canStationHandleItem(STATIONS.THEKE, foodItem), false);
  assert.equal(canStationHandleItem(STATIONS.KUECHE, drinkItem), false);
  assert.equal(canStationHandleItem(STATIONS.KUECHE, foodItem), true);
});

test('editing active orders is disabled by default but can be enabled by config', () => {
  const activeOrder = { status: ORDER_STATUSES.IN_PROGRESS };

  assert.equal(canEditOrder(activeOrder, DEFAULT_ORDER_RULES), false);
  assert.equal(
    canEditOrder(activeOrder, { allowOrderEditsAfterProcessingStarts: true }),
    true,
  );
});
