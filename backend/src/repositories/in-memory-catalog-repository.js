const {
  DEFAULT_CATALOG_CATEGORIES,
  DEFAULT_CATALOG_ITEMS,
} = require('../config/catalog');

function cloneCategory(category) {
  return { ...category };
}

function cloneItem(item) {
  return {
    ...item,
    searchTerms: Array.isArray(item.searchTerms) ? [...item.searchTerms] : [],
  };
}

class InMemoryCatalogRepository {
  constructor({
    categories = DEFAULT_CATALOG_CATEGORIES,
    items = DEFAULT_CATALOG_ITEMS,
  } = {}) {
    this.categories = categories.map(cloneCategory);
    this.items = items.map(cloneItem);
  }

  async listCategories() {
    return this.categories.map(cloneCategory);
  }

  async listItems() {
    return this.items.map(cloneItem);
  }

  async getItemByKey(itemKey) {
    const item = this.items.find((entry) => entry.key === itemKey);
    return item ? cloneItem(item) : null;
  }
}

module.exports = {
  InMemoryCatalogRepository,
};
