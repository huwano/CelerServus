const test = require('node:test');
const assert = require('node:assert/strict');

const { createCatalogController } = require('../src/controllers/catalog-controller');
const { InMemoryCatalogRepository } = require('../src/repositories/in-memory-catalog-repository');
const { CatalogService } = require('../src/services/catalog-service');
const { createMockResponse, createNextCollector } = require('./helpers/mock-http');

test('catalog controller responds with the catalog data envelope', async () => {
  const service = new CatalogService({ catalogRepository: new InMemoryCatalogRepository() });
  const controller = createCatalogController({ catalogService: service });
  const res = createMockResponse();
  const { calls, next } = createNextCollector();

  await controller.getCatalog({}, res, next);

  assert.equal(calls.length, 0);
  assert.ok(Array.isArray(res.body.data.categories));
  assert.ok(Array.isArray(res.body.data.items));
});
