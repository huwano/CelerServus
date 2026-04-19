class InMemoryOrderRepository {
  constructor(seedOrders = []) {
    this.orders = [...seedOrders];
    this.nextOrderId = seedOrders.length + 1;
    this.nextMessageId = 1;
  }

  async list() {
    return this.orders.map((order) => structuredClone(order));
  }

  async findById(orderId) {
    const order = this.orders.find((entry) => entry.id === orderId);
    return order ? structuredClone(order) : null;
  }

  generateOrderId() {
    return `order-${this.nextOrderId++}`;
  }

  async create(order) {
    const createdOrder = {
      ...structuredClone(order),
      id: order.id || this.generateOrderId(),
    };

    this.orders.push(createdOrder);
    return structuredClone(createdOrder);
  }

  async save(order) {
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

  async getOverviewStats() {
    const ordersByStatus = this.orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    const items = this.orders.flatMap((order) => order.items);
    const itemsByCategory = items.reduce((acc, item) => {
      const current = acc[item.category] || { lineCount: 0, quantityTotal: 0 };
      current.lineCount += 1;
      current.quantityTotal += item.quantity;
      acc[item.category] = current;
      return acc;
    }, {});

    const activeItemsByStation = items
      .filter((item) => ['new', 'in_progress'].includes(item.status))
      .reduce((acc, item) => {
        acc[item.station] = (acc[item.station] || 0) + 1;
        return acc;
      }, {});

    const totalMessages = this.orders.reduce((sum, order) => sum + order.messages.length, 0);
    const busyTables = new Set(
      this.orders
        .filter((order) => ['open', 'in_progress'].includes(order.status))
        .map((order) => order.tableNumber),
    ).size;

    return {
      ordersByStatus,
      itemsByCategory,
      activeItemsByStation,
      totalMessages,
      busyTables,
    };
  }
}

module.exports = {
  InMemoryOrderRepository,
};
