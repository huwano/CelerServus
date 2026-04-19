class PostgresCatalogRepository {
  constructor({ pool }) {
    this.pool = pool;
  }

  async listCategories() {
    const result = await this.pool.query(
      `
        SELECT key, label, station, sort_order
        FROM catalog_categories
        ORDER BY sort_order ASC, label ASC
      `,
    );

    return result.rows.map((row) => ({
      key: row.key,
      label: row.label,
      station: row.station,
      sortOrder: row.sort_order,
    }));
  }

  async listItems() {
    const result = await this.pool.query(
      `
        SELECT key, label, category_key, station, sort_order, is_active, search_terms
        FROM catalog_items
        ORDER BY sort_order ASC, label ASC
      `,
    );

    return result.rows.map((row) => ({
      key: row.key,
      label: row.label,
      category: row.category_key,
      station: row.station,
      sortOrder: row.sort_order,
      isActive: row.is_active,
      searchTerms: row.search_terms || [],
    }));
  }

  async getItemByKey(itemKey) {
    const result = await this.pool.query(
      `
        SELECT key, label, category_key, station, sort_order, is_active, search_terms
        FROM catalog_items
        WHERE key = $1
        LIMIT 1
      `,
      [itemKey],
    );

    const row = result.rows[0];

    if (!row) {
      return null;
    }

    return {
      key: row.key,
      label: row.label,
      category: row.category_key,
      station: row.station,
      sortOrder: row.sort_order,
      isActive: row.is_active,
      searchTerms: row.search_terms || [],
    };
  }
}

module.exports = {
  PostgresCatalogRepository,
};
