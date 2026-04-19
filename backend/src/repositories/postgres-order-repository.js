const { randomUUID } = require('node:crypto');

function hydrateOrders(orders, itemRows, messageRows) {
  const itemsByOrderId = new Map();
  const messagesByOrderId = new Map();

  itemRows.forEach((row) => {
    const items = itemsByOrderId.get(row.order_id) || [];
    items.push({
      id: row.id,
      catalogItemKey: row.catalog_item_key,
      name: row.name,
      quantity: row.quantity,
      category: row.category,
      station: row.station,
      status: row.status,
      createdAt: row.created_at.toISOString(),
    });
    itemsByOrderId.set(row.order_id, items);
  });

  messageRows.forEach((row) => {
    const messages = messagesByOrderId.get(row.order_id) || [];
    messages.push({
      id: row.id,
      orderId: row.order_id,
      authorUserId: row.author_user_id,
      message: row.message,
      targetStations: row.target_stations,
      createdAt: row.created_at.toISOString(),
    });
    messagesByOrderId.set(row.order_id, messages);
  });

  return orders.map((row) => ({
    id: row.id,
    tableNumber: row.table_number,
    createdByUserId: row.created_by_user_id,
    createdAt: row.created_at.toISOString(),
    status: row.status,
    initialNote: row.initial_note,
    items: itemsByOrderId.get(row.id) || [],
    messages: messagesByOrderId.get(row.id) || [],
  }));
}

class PostgresOrderRepository {
  constructor({ pool }) {
    this.pool = pool;
  }

  generateOrderId() {
    return `order-${randomUUID()}`;
  }

  generateMessageId() {
    return `message-${randomUUID()}`;
  }

  async list() {
    const ordersResult = await this.pool.query(
      `
        SELECT id, table_number, created_by_user_id, created_at, status, initial_note
        FROM orders
        ORDER BY created_at DESC
      `,
    );

    if (ordersResult.rows.length === 0) {
      return [];
    }

    return this.#loadHydratedOrders(ordersResult.rows);
  }

  async findById(orderId) {
    const ordersResult = await this.pool.query(
      `
        SELECT id, table_number, created_by_user_id, created_at, status, initial_note
        FROM orders
        WHERE id = $1
        LIMIT 1
      `,
      [orderId],
    );

    if (ordersResult.rows.length === 0) {
      return null;
    }

    const [order] = await this.#loadHydratedOrders(ordersResult.rows);
    return order;
  }

  async create(order) {
    const orderId = order.id || this.generateOrderId();
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');
      await client.query(
        `
          INSERT INTO orders (id, table_number, created_by_user_id, created_at, status, initial_note)
          VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          orderId,
          order.tableNumber,
          order.createdByUserId,
          order.createdAt,
          order.status,
          order.initialNote || '',
        ],
      );

      for (const item of order.items) {
        await client.query(
          `
            INSERT INTO order_items (
              id,
              order_id,
              catalog_item_key,
              name,
              quantity,
              category,
              station,
              status,
              created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          `,
          [
            item.id,
            orderId,
            item.catalogItemKey || null,
            item.name,
            item.quantity,
            item.category,
            item.station,
            item.status,
            item.createdAt || order.createdAt,
          ],
        );
      }

      for (const message of order.messages || []) {
        await client.query(
          `
            INSERT INTO order_messages (id, order_id, author_user_id, message, target_stations, created_at)
            VALUES ($1, $2, $3, $4, $5, $6)
          `,
          [
            message.id,
            orderId,
            message.authorUserId,
            message.message,
            message.targetStations,
            message.createdAt || order.createdAt,
          ],
        );
      }

      await client.query('COMMIT');
      return this.findById(orderId);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async save(order) {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');
      await client.query(
        `
          UPDATE orders
          SET table_number = $2,
              created_by_user_id = $3,
              created_at = $4,
              status = $5,
              initial_note = $6
          WHERE id = $1
        `,
        [
          order.id,
          order.tableNumber,
          order.createdByUserId,
          order.createdAt,
          order.status,
          order.initialNote || '',
        ],
      );

      await client.query('DELETE FROM order_items WHERE order_id = $1', [order.id]);
      await client.query('DELETE FROM order_messages WHERE order_id = $1', [order.id]);

      for (const item of order.items) {
        await client.query(
          `
            INSERT INTO order_items (
              id,
              order_id,
              catalog_item_key,
              name,
              quantity,
              category,
              station,
              status,
              created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          `,
          [
            item.id,
            order.id,
            item.catalogItemKey || null,
            item.name,
            item.quantity,
            item.category,
            item.station,
            item.status,
            item.createdAt || order.createdAt,
          ],
        );
      }

      for (const message of order.messages || []) {
        await client.query(
          `
            INSERT INTO order_messages (id, order_id, author_user_id, message, target_stations, created_at)
            VALUES ($1, $2, $3, $4, $5, $6)
          `,
          [
            message.id,
            order.id,
            message.authorUserId,
            message.message,
            message.targetStations,
            message.createdAt,
          ],
        );
      }

      await client.query('COMMIT');
      return this.findById(order.id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getOverviewStats() {
    const [statusCounts, categoryCounts, stationCounts, messageCounts, tableCounts] = await Promise.all([
      this.pool.query('SELECT status, COUNT(*)::int AS count FROM orders GROUP BY status'),
      this.pool.query(
        `
          SELECT category, COUNT(*)::int AS line_count, COALESCE(SUM(quantity), 0)::int AS quantity_total
          FROM order_items
          GROUP BY category
        `,
      ),
      this.pool.query(
        `
          SELECT station, COUNT(*)::int AS active_item_count
          FROM order_items
          WHERE status IN ('new', 'in_progress')
          GROUP BY station
        `,
      ),
      this.pool.query(
        `
          SELECT COUNT(*)::int AS total_messages
          FROM order_messages
        `,
      ),
      this.pool.query(
        `
          SELECT COUNT(DISTINCT table_number)::int AS busy_tables
          FROM orders
          WHERE status IN ('open', 'in_progress')
        `,
      ),
    ]);

    return {
      ordersByStatus: Object.fromEntries(
        statusCounts.rows.map((row) => [row.status, row.count]),
      ),
      itemsByCategory: Object.fromEntries(
        categoryCounts.rows.map((row) => [
          row.category,
          {
            lineCount: row.line_count,
            quantityTotal: row.quantity_total,
          },
        ]),
      ),
      activeItemsByStation: Object.fromEntries(
        stationCounts.rows.map((row) => [row.station, row.active_item_count]),
      ),
      totalMessages: messageCounts.rows[0]?.total_messages || 0,
      busyTables: tableCounts.rows[0]?.busy_tables || 0,
    };
  }

  async #loadHydratedOrders(orderRows) {
    const orderIds = orderRows.map((row) => row.id);
    const [itemsResult, messagesResult] = await Promise.all([
      this.pool.query(
        `
          SELECT id, order_id, catalog_item_key, name, quantity, category, station, status, created_at
          FROM order_items
          WHERE order_id = ANY($1::text[])
          ORDER BY created_at ASC, id ASC
        `,
        [orderIds],
      ),
      this.pool.query(
        `
          SELECT id, order_id, author_user_id, message, target_stations, created_at
          FROM order_messages
          WHERE order_id = ANY($1::text[])
          ORDER BY created_at ASC, id ASC
        `,
        [orderIds],
      ),
    ]);

    return hydrateOrders(orderRows, itemsResult.rows, messagesResult.rows);
  }
}

module.exports = {
  PostgresOrderRepository,
};
