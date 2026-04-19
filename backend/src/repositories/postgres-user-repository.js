const { verifyPassword } = require('../db/password');

class PostgresUserRepository {
  constructor({ pool }) {
    this.pool = pool;
  }

  async findByCredentials(username, password) {
    const result = await this.pool.query(
      `
        SELECT id, username, password_hash, role
        FROM users
        WHERE username = $1
        LIMIT 1
      `,
      [username],
    );

    const row = result.rows[0];

    if (!row) {
      return null;
    }

    const matches = await verifyPassword(password, row.password_hash);

    if (!matches) {
      return null;
    }

    return {
      id: row.id,
      username: row.username,
      role: row.role,
    };
  }

  async listAll() {
    const result = await this.pool.query(
      `
        SELECT id, username, role, created_at
        FROM users
        ORDER BY created_at ASC
      `,
    );

    return result.rows.map((row) => ({
      id: row.id,
      username: row.username,
      role: row.role,
      createdAt: row.created_at.toISOString(),
    }));
  }
}

module.exports = {
  PostgresUserRepository,
};
