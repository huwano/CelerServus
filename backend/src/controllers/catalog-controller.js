function createCatalogController({ catalogService }) {
  return {
    async getCatalog(_req, res, next) {
      try {
        const catalog = await catalogService.getCatalog();
        return res.json({ data: catalog });
      } catch (error) {
        return next(error);
      }
    },
  };
}

module.exports = {
  createCatalogController,
};
