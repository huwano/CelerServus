const test = require('node:test');
const assert = require('node:assert/strict');

const { InMemoryCatalogRepository } = require('../src/repositories/in-memory-catalog-repository');
const { CatalogService } = require('../src/services/catalog-service');

test('catalog service returns categories and items from the repository', async () => {
  const service = new CatalogService({ catalogRepository: new InMemoryCatalogRepository() });

  const catalog = await service.getCatalog();

  assert.ok(Array.isArray(catalog.categories));
  assert.ok(Array.isArray(catalog.items));
  assert.ok(catalog.categories.length > 0);
  assert.ok(catalog.items.length > 0);
});
