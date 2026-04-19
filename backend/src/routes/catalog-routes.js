const express = require('express');
const { requireAuthenticatedUser } = require('../middleware/auth');

function createCatalogRouter({ catalogController }) {
  const router = express.Router();

  router.use(requireAuthenticatedUser);
  router.get('/catalog', catalogController.getCatalog);

  return router;
}

module.exports = {
  createCatalogRouter,
};
