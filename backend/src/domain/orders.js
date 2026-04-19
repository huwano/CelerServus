const { DEFAULT_ORDER_RULES } = require('../config/order-rules');

const ITEM_CATEGORIES = Object.freeze({
  FOOD: 'food',
  DRINK: 'drink',
});

const STATIONS = Object.freeze({
  KUECHE: 'kueche',
  THEKE: 'theke',
});

const ORDER_ITEM_STATUSES = Object.freeze({
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  READY: 'ready',
  CANCELLED: 'cancelled',
});

const ORDER_STATUSES = Object.freeze({
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
});

const MESSAGE_TARGETS = Object.freeze({
  THEKE: STATIONS.THEKE,
  KUECHE: STATIONS.KUECHE,
  BOTH: 'both',
});

function getStationForCategory(category) {
  if (category === ITEM_CATEGORIES.DRINK) {
    return STATIONS.THEKE;
  }

  if (category === ITEM_CATEGORIES.FOOD) {
    return STATIONS.KUECHE;
  }

  throw new Error(`Unsupported item category: ${category}`);
}

function normalizeOrderItem(item, index) {
  if (!item?.name) {
    throw new Error('Order item name is required');
  }

  if (!Number.isInteger(item.quantity) || item.quantity < 1) {
    throw new Error('Order item quantity must be a positive integer');
  }

  const station = item.station || getStationForCategory(item.category);

  return {
    id: item.id || `item-${index + 1}`,
    catalogItemKey: item.catalogItemKey || null,
    name: item.name,
    quantity: item.quantity,
    category: item.category,
    station,
    status: item.status || ORDER_ITEM_STATUSES.NEW,
    createdAt: item.createdAt || new Date().toISOString(),
  };
}

function deriveOrderStatus(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('At least one order item is required');
  }

  const statuses = items.map((item) => item.status);
  const allCancelled = statuses.every((status) => status === ORDER_ITEM_STATUSES.CANCELLED);
  const anyReady = statuses.some((status) => status === ORDER_ITEM_STATUSES.READY);
  const anyInProgress = statuses.some((status) => status === ORDER_ITEM_STATUSES.IN_PROGRESS);
  const allReadyOrCancelled = statuses.every((status) =>
    [ORDER_ITEM_STATUSES.READY, ORDER_ITEM_STATUSES.CANCELLED].includes(status),
  );

  if (allCancelled) {
    return ORDER_STATUSES.CANCELLED;
  }

  if (allReadyOrCancelled && anyReady) {
    return ORDER_STATUSES.COMPLETED;
  }

  if (anyReady || anyInProgress) {
    return ORDER_STATUSES.IN_PROGRESS;
  }

  return ORDER_STATUSES.OPEN;
}

function createOrder({
  id = 'order-1',
  tableNumber,
  createdByUserId,
  initialNote = '',
  items,
  messages = [],
  createdAt = new Date().toISOString(),
}) {
  if (!tableNumber) {
    throw new Error('Table number is required');
  }

  if (!createdByUserId) {
    throw new Error('Creating user is required');
  }

  const normalizedItems = items.map(normalizeOrderItem);

  return {
    id,
    tableNumber,
    createdByUserId,
    createdAt,
    status: deriveOrderStatus(normalizedItems),
    initialNote: initialNote.trim(),
    items: normalizedItems,
    messages,
  };
}

function normalizeTargetStations(target) {
  if (target === MESSAGE_TARGETS.BOTH) {
    return [STATIONS.THEKE, STATIONS.KUECHE];
  }

  const targets = Array.isArray(target) ? target : [target];
  const uniqueTargets = [...new Set(targets)];
  const validTargets = new Set(Object.values(STATIONS));

  if (uniqueTargets.length === 0 || uniqueTargets.some((station) => !validTargets.has(station))) {
    throw new Error('A valid target station is required');
  }

  return uniqueTargets;
}

function createOrderMessage({
  id = 'message-1',
  orderId,
  authorUserId,
  message,
  targetStations,
  createdAt = new Date().toISOString(),
}) {
  if (!orderId) {
    throw new Error('Order id is required');
  }

  if (!authorUserId) {
    throw new Error('Author user id is required');
  }

  if (!message?.trim()) {
    throw new Error('Message text is required');
  }

  return {
    id,
    orderId,
    authorUserId,
    message: message.trim(),
    targetStations: normalizeTargetStations(targetStations),
    createdAt,
  };
}

function getVisibleMessagesForStation(messages, station) {
  return messages.filter((message) => message.targetStations.includes(station));
}

function canStationHandleItem(role, item) {
  return (
    (role === STATIONS.THEKE && item.station === STATIONS.THEKE) ||
    (role === STATIONS.KUECHE && item.station === STATIONS.KUECHE)
  );
}

function canEditOrder(order, rules = DEFAULT_ORDER_RULES) {
  if ([ORDER_STATUSES.COMPLETED, ORDER_STATUSES.CANCELLED].includes(order.status)) {
    return false;
  }

  if (rules.allowOrderEditsAfterProcessingStarts) {
    return true;
  }

  return order.status === ORDER_STATUSES.OPEN;
}

module.exports = {
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
  getStationForCategory,
  getVisibleMessagesForStation,
};
