const fs = require('node:fs/promises');
const path = require('node:path');
const { loadBackendEnv } = require('../env');
const { DEFAULT_DEMO_USERS } = require('../repositories/in-memory-user-repository');
const {
  DEFAULT_CATALOG_CATEGORIES,
  DEFAULT_CATALOG_ITEMS,
} = require('../config/catalog');
const { createPostgresPool } = require('./postgres');
const { hashPassword } = require('./password');

loadBackendEnv();

async function run() {
  const pool = createPostgresPool();

  try {
    const schemaPath = path.join(__dirname, 'sql', 'schema.sql');
    const schemaSql = await fs.readFile(schemaPath, 'utf8');
    await pool.query(schemaSql);

    for (const user of DEFAULT_DEMO_USERS) {
      const passwordHash = await hashPassword(user.password);

      await pool.query(
        `
          INSERT INTO users (id, username, password_hash, role)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (id) DO UPDATE
          SET username = EXCLUDED.username,
              password_hash = EXCLUDED.password_hash,
              role = EXCLUDED.role
        `,
        [user.id, user.username, passwordHash, user.role],
      );
    }

    for (const category of DEFAULT_CATALOG_CATEGORIES) {
      await pool.query(
        `
          INSERT INTO catalog_categories (key, label, station, sort_order)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (key) DO UPDATE
          SET label = EXCLUDED.label,
              station = EXCLUDED.station,
              sort_order = EXCLUDED.sort_order
        `,
        [category.key, category.label, category.station, category.sortOrder || 0],
      );
    }

    for (const item of DEFAULT_CATALOG_ITEMS) {
      await pool.query(
        `
          INSERT INTO catalog_items (key, label, category_key, station, sort_order, is_active, search_terms)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (key) DO UPDATE
          SET label = EXCLUDED.label,
              category_key = EXCLUDED.category_key,
              station = EXCLUDED.station,
              sort_order = EXCLUDED.sort_order,
              is_active = EXCLUDED.is_active,
              search_terms = EXCLUDED.search_terms
        `,
        [
          item.key,
          item.label,
          item.category,
          item.station,
          item.sortOrder || 0,
          item.isActive !== false,
          item.searchTerms || [],
        ],
      );
    }

    console.log('PostgreSQL schema and seed data initialized.');
  } finally {
    await pool.end();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
