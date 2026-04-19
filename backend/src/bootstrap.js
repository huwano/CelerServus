const { createPostgresPool } = require('./db/postgres');
const { InMemoryCatalogRepository } = require('./repositories/in-memory-catalog-repository');
const { InMemoryOrderRepository } = require('./repositories/in-memory-order-repository');
const { InMemoryUserRepository } = require('./repositories/in-memory-user-repository');
const { PostgresCatalogRepository } = require('./repositories/postgres-catalog-repository');
const { PostgresOrderRepository } = require('./repositories/postgres-order-repository');
const { PostgresUserRepository } = require('./repositories/postgres-user-repository');
const { getStorageMode } = require('./config/runtime');

async function bootstrapRepositories(env = process.env) {
  const storageMode = getStorageMode(env);

  if (storageMode === 'memory') {
    console.warn('Backend storage mode is "memory". Data will not persist across restarts.');

    return {
      mode: 'memory',
      catalogRepository: new InMemoryCatalogRepository(),
      orderRepository: new InMemoryOrderRepository(),
      userRepository: new InMemoryUserRepository(),
      async close() {},
    };
  }

  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required when BACKEND_STORAGE_MODE=postgres');
  }

  const pool = createPostgresPool(env);
  await pool.query('SELECT 1');

  console.log('Connected to PostgreSQL.');

  return {
    mode: 'postgres',
    pool,
    catalogRepository: new PostgresCatalogRepository({ pool }),
    orderRepository: new PostgresOrderRepository({ pool }),
    userRepository: new PostgresUserRepository({ pool }),
    async close() {
      await pool.end();
    },
  };
}

module.exports = {
  bootstrapRepositories,
};
