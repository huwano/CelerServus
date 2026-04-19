const { ROLES } = require('../config/roles');
const {
  MESSAGE_TARGETS,
  ITEM_CATEGORIES,
  ORDER_ITEM_STATUSES,
  STATIONS,
  createOrder,
  createOrderMessage,
  deriveOrderStatus,
  getVisibleMessagesForStation,
} = require('../domain/orders');
const { HttpError } = require('../http-error');
const {
  assertPlainObject,
  createValidationError,
  normalizeOptionalTrimmedString,
  requireTrimmedString,
  toValidationError,
} = require('../validation');

function isAdmin(actor) {
  return actor.role === ROLES.ADMIN;
}

function isOwner(actor, order) {
  return actor.id === order.createdByUserId;
}

function assertCanReadOrder(actor, order) {
  if (isAdmin(actor)) {
    return;
  }

  if (actor.role === ROLES.BEDIENUNG && isOwner(actor, order)) {
    return;
  }

  if (actor.role === ROLES.THEKE && order.items.some((item) => item.station === STATIONS.THEKE)) {
    return;
  }

  if (actor.role === ROLES.KUECHE && order.items.some((item) => item.station === STATIONS.KUECHE)) {
    return;
  }

  throw new HttpError(403, 'forbidden', 'You are not allowed to access this order');
}

function projectOrderForActor(order, actor) {
  if (isAdmin(actor) || (actor.role === ROLES.BEDIENUNG && isOwner(actor, order))) {
    return order;
  }

  if (actor.role === ROLES.THEKE) {
    return {
      ...order,
      items: order.items.filter((item) => item.station === STATIONS.THEKE),
      messages: getVisibleMessagesForStation(order.messages, STATIONS.THEKE),
    };
  }

  if (actor.role === ROLES.KUECHE) {
    return {
      ...order,
      items: order.items.filter((item) => item.station === STATIONS.KUECHE),
      messages: getVisibleMessagesForStation(order.messages, STATIONS.KUECHE),
    };
  }

  return order;
}

function assertCanCreateOrder(actor) {
  if ([ROLES.BEDIENUNG, ROLES.ADMIN].includes(actor.role)) {
    return;
  }

  throw new HttpError(403, 'forbidden', 'You are not allowed to create orders');
}

function assertCanAddMessage(actor, order) {
  if (isAdmin(actor)) {
    return;
  }

  if (actor.role === ROLES.BEDIENUNG && isOwner(actor, order)) {
    return;
  }

  throw new HttpError(403, 'forbidden', 'You are not allowed to add messages to this order');
}

function assertCanUpdateItemStatus(actor, item) {
  if (isAdmin(actor)) {
    return;
  }

  if (actor.role === ROLES.THEKE && item.station === STATIONS.THEKE) {
    return;
  }

  if (actor.role === ROLES.KUECHE && item.station === STATIONS.KUECHE) {
    return;
  }

  throw new HttpError(403, 'forbidden', 'You are not allowed to update this item');
}

function assertCanCancelOrderItem(actor, order, item) {
  if (isAdmin(actor)) {
    return;
  }

  if (
    actor.role === ROLES.BEDIENUNG &&
    isOwner(actor, order) &&
    item.status === ORDER_ITEM_STATUSES.NEW
  ) {
    return;
  }

  throw new HttpError(403, 'forbidden', 'You are not allowed to cancel this item');
}

function assertValidStatusTransition(currentStatus, nextStatus, actor) {
  const allowedStatuses = new Set(Object.values(ORDER_ITEM_STATUSES));

  if (!allowedStatuses.has(nextStatus)) {
    throw new HttpError(400, 'invalid_status', 'Unsupported order item status');
  }

  if (isAdmin(actor)) {
    return;
  }

  const transitions = {
    [ORDER_ITEM_STATUSES.NEW]: [ORDER_ITEM_STATUSES.IN_PROGRESS],
    [ORDER_ITEM_STATUSES.IN_PROGRESS]: [ORDER_ITEM_STATUSES.READY],
    [ORDER_ITEM_STATUSES.READY]: [],
    [ORDER_ITEM_STATUSES.CANCELLED]: [],
  };

  if (!transitions[currentStatus]?.includes(nextStatus)) {
    throw new HttpError(409, 'invalid_transition', 'This status transition is not allowed');
  }
}

function normalizeTableNumber(tableNumber) {
  if (typeof tableNumber === 'number' && Number.isFinite(tableNumber)) {
    return String(tableNumber);
  }

  return requireTrimmedString(tableNumber, 'tableNumber', 'Table number is required');
}

function normalizeCreatedByUserId(createdByUserId, actor) {
  if (createdByUserId === undefined) {
    return actor.id;
  }

  return requireTrimmedString(createdByUserId, 'createdByUserId', 'Creating user is required');
}

function validateOrderItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw createValidationError('At least one order item is required', { field: 'items' });
  }

  items.forEach((item, index) => {
    if (item === null || typeof item !== 'object' || Array.isArray(item)) {
      throw createValidationError('Each order item must be an object', {
        field: `items[${index}]`,
      });
    }

    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      throw createValidationError('Order item quantity must be a positive integer', {
        field: `items[${index}].quantity`,
      });
    }

    if (item.catalogItemKey !== undefined && item.catalogItemKey !== null) {
      requireTrimmedString(
        item.catalogItemKey,
        `items[${index}].catalogItemKey`,
        'Catalog item key is required',
      );
      return;
    }

    requireTrimmedString(item.name, `items[${index}].name`, 'Order item name is required');

    if (!Object.values(ITEM_CATEGORIES).includes(item.category)) {
      throw createValidationError('Unsupported item category', {
        field: `items[${index}].category`,
      });
    }
  });
}

async function normalizeCreateOrderPayload(payload, actor, catalogRepository) {
  assertPlainObject(payload, 'Invalid order payload');
  validateOrderItems(payload.items);

  const normalizedItems = await Promise.all(
    payload.items.map(async (item, index) => {
      if (item.catalogItemKey && catalogRepository?.getItemByKey) {
        const catalogItem = await catalogRepository.getItemByKey(item.catalogItemKey);

        if (!catalogItem || catalogItem.isActive === false) {
          throw createValidationError('Unknown catalog item', {
            field: `items[${index}].catalogItemKey`,
          });
        }

        return {
          catalogItemKey: catalogItem.key,
          name: catalogItem.label,
          quantity: item.quantity,
          category: catalogItem.category,
          station: catalogItem.station,
        };
      }

      return item;
    }),
  );

  return {
    tableNumber: normalizeTableNumber(payload.tableNumber),
    createdByUserId: normalizeCreatedByUserId(payload.createdByUserId, actor),
    initialNote: normalizeOptionalTrimmedString(payload.initialNote, 'initialNote'),
    items: normalizedItems,
  };
}

function normalizeOrderMessagePayload(payload) {
  assertPlainObject(payload, 'Invalid order message payload');

  return {
    message: requireTrimmedString(payload.message, 'message', 'Message text is required'),
    targetStations: payload.targetStations || MESSAGE_TARGETS.BOTH,
  };
}

function normalizeOrderItemStatusPayload(payload) {
  assertPlainObject(payload, 'Invalid order item update payload');

  return {
    status: requireTrimmedString(payload.status, 'status', 'Order item status is required'),
  };
}

class OrderService {
  constructor({ orderRepository, catalogRepository = null }) {
    this.orderRepository = orderRepository;
    this.catalogRepository = catalogRepository;
  }

  async listOrders(actor) {
    const orders = await this.orderRepository.list();

    return orders
      .filter((order) => {
        try {
          assertCanReadOrder(actor, order);
          return true;
        } catch {
          return false;
        }
      })
      .map((order) => projectOrderForActor(order, actor));
  }

  async getOrder(actor, orderId) {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new HttpError(404, 'order_not_found', 'Order not found');
    }

    assertCanReadOrder(actor, order);
    return projectOrderForActor(order, actor);
  }

  async createOrder(actor, payload) {
    assertCanCreateOrder(actor);

    const normalizedPayload = await normalizeCreateOrderPayload(
      payload,
      actor,
      this.catalogRepository,
    );
    let order;

    try {
      order = createOrder({
        ...normalizedPayload,
        id: this.orderRepository.generateOrderId?.(),
      });
    } catch (error) {
      throw toValidationError(error, 'Invalid order payload');
    }

    return this.orderRepository.create(order);
  }

  async addMessage(actor, orderId, payload) {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new HttpError(404, 'order_not_found', 'Order not found');
    }

    assertCanAddMessage(actor, order);

    const normalizedPayload = normalizeOrderMessagePayload(payload);
    let message;

    try {
      message = createOrderMessage({
        id: this.orderRepository.generateMessageId(),
        orderId,
        authorUserId: actor.id,
        message: normalizedPayload.message,
        targetStations: normalizedPayload.targetStations,
      });
    } catch (error) {
      throw toValidationError(error, 'Invalid order message payload');
    }

    order.messages = [...order.messages, message];
    const savedOrder = await this.orderRepository.save(order);

    return savedOrder.messages.at(-1);
  }

  async updateOrderItemStatus(actor, orderId, itemId, payload) {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new HttpError(404, 'order_not_found', 'Order not found');
    }

    const item = order.items.find((entry) => entry.id === itemId);

    if (!item) {
      throw new HttpError(404, 'order_item_not_found', 'Order item not found');
    }

    assertCanUpdateItemStatus(actor, item);
    const normalizedPayload = normalizeOrderItemStatusPayload(payload);
    assertValidStatusTransition(item.status, normalizedPayload.status, actor);

    item.status = normalizedPayload.status;
    order.status = deriveOrderStatus(order.items);

    const savedOrder = await this.orderRepository.save(order);
    return savedOrder.items.find((entry) => entry.id === itemId);
  }

  async cancelOrderItem(actor, orderId, itemId) {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new HttpError(404, 'order_not_found', 'Order not found');
    }

    const item = order.items.find((entry) => entry.id === itemId);

    if (!item) {
      throw new HttpError(404, 'order_item_not_found', 'Order item not found');
    }

    assertCanCancelOrderItem(actor, order, item);

    if (item.status === ORDER_ITEM_STATUSES.CANCELLED) {
      throw new HttpError(409, 'invalid_transition', 'Item is already cancelled');
    }

    item.status = ORDER_ITEM_STATUSES.CANCELLED;
    order.status = deriveOrderStatus(order.items);

    const savedOrder = await this.orderRepository.save(order);
    return savedOrder.items.find((entry) => entry.id === itemId);
  }
}

module.exports = {
  OrderService,
};
