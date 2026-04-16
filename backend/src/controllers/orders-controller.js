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
    listOrders(req, res, next) {
      try {
        const orders = orderService.listOrders(req.user);
        return res.json({ data: orders });
      } catch (error) {
        return next(error);
      }
    },

    getOrder(req, res, next) {
      try {
        const order = orderService.getOrder(req.user, req.params.orderId);
        return res.json({ data: order });
      } catch (error) {
        return next(error);
      }
    },

    createOrder(req, res, next) {
      try {
        const order = orderService.createOrder(req.user, req.body);
        notifyOrderChanged(orderEvents, {
          orderId: order.id,
          type: 'order_created',
        });
        return res.status(201).json({ data: order });
      } catch (error) {
        return next(error);
      }
    },

    addOrderMessage(req, res, next) {
      try {
        const message = orderService.addMessage(req.user, req.params.orderId, req.body);
        notifyOrderChanged(orderEvents, {
          orderId: req.params.orderId,
          type: 'message_added',
        });
        return res.status(201).json({ data: message });
      } catch (error) {
        return next(error);
      }
    },

    updateOrderItem(req, res, next) {
      try {
        const item = orderService.updateOrderItemStatus(
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
