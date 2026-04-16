class InMemoryOrderRepository {
  constructor(seedOrders = []) {
    this.orders = [...seedOrders];
    this.nextOrderId = seedOrders.length + 1;
    this.nextMessageId = 1;
  }

  list() {
    return this.orders.map((order) => structuredClone(order));
  }

  findById(orderId) {
    const order = this.orders.find((entry) => entry.id === orderId);
    return order ? structuredClone(order) : null;
  }

  create(order) {
    const createdOrder = {
      ...structuredClone(order),
      id: order.id || `order-${this.nextOrderId++}`,
    };

    this.orders.push(createdOrder);
    return structuredClone(createdOrder);
  }

  save(order) {
    const index = this.orders.findIndex((entry) => entry.id === order.id);

    if (index === -1) {
      throw new Error(`Order not found: ${order.id}`);
    }

    this.orders[index] = structuredClone(order);
    return structuredClone(this.orders[index]);
  }

  generateMessageId() {
    return `message-${this.nextMessageId++}`;
  }
}

module.exports = {
  InMemoryOrderRepository,
};
