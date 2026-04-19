const { Pool } = require('pg');

function createPostgresPool(env = process.env) {
  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required for PostgreSQL mode');
  }

  return new Pool({
    connectionString: env.DATABASE_URL,
    ssl:
      env.DATABASE_SSL === 'true'
        ? {
            rejectUnauthorized: false,
          }
        : false,
  });
}

module.exports = {
  createPostgresPool,
};
