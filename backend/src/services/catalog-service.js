class CatalogService {
  constructor({ catalogRepository }) {
    this.catalogRepository = catalogRepository;
  }

  async getCatalog() {
    const [categories, items] = await Promise.all([
      this.catalogRepository.listCategories(),
      this.catalogRepository.listItems(),
    ]);

    return {
      categories,
      items,
    };
  }
}

module.exports = {
  CatalogService,
};
