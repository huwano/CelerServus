function notifyOrderChanged(orderEvents, change) {
  try {
    orderEvents.publishOrderChanged(change);
  } catch (error) {
    console.error('Failed to publish order change', error);
  }
}

function createOrdersController({
  orderService,
  orderEvents = { publishOrderChanged() {} },
}) {
  return {
    async listOrders(req, res, next) {
      try {
        const orders = await orderService.listOrders(req.user);
        return res.json({ data: orders });
      } catch (error) {
        return next(error);
      }
    },

    async getOrder(req, res, next) {
      try {
        const order = await orderService.getOrder(req.user, req.params.orderId);
        return res.json({ data: order });
      } catch (error) {
        return next(error);
      }
    },

    async createOrder(req, res, next) {
      try {
        const order = await orderService.createOrder(req.user, req.body);
        notifyOrderChanged(orderEvents, {
          orderId: order.id,
          type: 'order_created',
        });
        return res.status(201).json({ data: order });
      } catch (error) {
        return next(error);
      }
    },

    async addOrderMessage(req, res, next) {
      try {
        const message = await orderService.addMessage(req.user, req.params.orderId, req.body);
        notifyOrderChanged(orderEvents, {
          orderId: req.params.orderId,
          type: 'message_added',
        });
        return res.status(201).json({ data: message });
      } catch (error) {
        return next(error);
      }
    },

    async updateOrderItem(req, res, next) {
      try {
        const item = await orderService.updateOrderItemStatus(
          req.user,
          req.params.orderId,
          req.params.itemId,
          req.body,
        );
        notifyOrderChanged(orderEvents, {
          orderId: req.params.orderId,
          type: 'item_status_updated',
        });
        return res.json({ data: item });
      } catch (error) {
        return next(error);
      }
    },
  };
}

module.exports = {
  createOrdersController,
};
