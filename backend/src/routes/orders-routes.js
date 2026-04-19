const express = require('express');

const { requireAuthenticatedUser } = require('../middleware/auth');

function createOrdersRouter({ ordersController }) {
  const router = express.Router();

  router.use(requireAuthenticatedUser);
  router.get('/orders', ordersController.listOrders);
  router.get('/orders/:orderId', ordersController.getOrder);
  router.post('/orders', ordersController.createOrder);
  router.post('/orders/:orderId/messages', ordersController.addOrderMessage);
  router.patch('/orders/:orderId/items/:itemId', ordersController.updateOrderItem);
  router.delete('/orders/:orderId/items/:itemId', ordersController.cancelOrderItem);

  return router;
}

module.exports = {
  createOrdersRouter,
};
