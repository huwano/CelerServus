const { ITEM_CATEGORIES, STATIONS } = require('../domain/orders');

const DEFAULT_CATALOG_CATEGORIES = Object.freeze([
  {
    key: ITEM_CATEGORIES.DRINK,
    label: 'Getränk',
    station: STATIONS.THEKE,
    sortOrder: 10,
  },
  {
    key: ITEM_CATEGORIES.FOOD,
    label: 'Speise',
    station: STATIONS.KUECHE,
    sortOrder: 20,
  },
]);

const DEFAULT_CATALOG_ITEMS = Object.freeze([
  {
    key: 'riesling-schorle',
    label: 'Riesling Schorle',
    category: ITEM_CATEGORIES.DRINK,
    station: STATIONS.THEKE,
    sortOrder: 10,
    isActive: true,
    searchTerms: ['wein', 'schorle', 'riesling'],
  },
  {
    key: 'apfelschorle',
    label: 'Apfelschorle',
    category: ITEM_CATEGORIES.DRINK,
    station: STATIONS.THEKE,
    sortOrder: 20,
    isActive: true,
    searchTerms: ['apfel', 'schorle', 'saft'],
  },
  {
    key: 'wasser',
    label: 'Wasser',
    category: ITEM_CATEGORIES.DRINK,
    station: STATIONS.THEKE,
    sortOrder: 30,
    isActive: true,
    searchTerms: ['still', 'sprudel', 'wasser'],
  },
  {
    key: 'sekt',
    label: 'Sekt',
    category: ITEM_CATEGORIES.DRINK,
    station: STATIONS.THEKE,
    sortOrder: 40,
    isActive: true,
    searchTerms: ['sekt', 'schaumwein'],
  },
  {
    key: 'flammkuchen-klassik',
    label: 'Flammkuchen Klassik',
    category: ITEM_CATEGORIES.FOOD,
    station: STATIONS.KUECHE,
    sortOrder: 110,
    isActive: true,
    searchTerms: ['flammkuchen', 'klassik', 'speck'],
  },
  {
    key: 'pommes',
    label: 'Pommes',
    category: ITEM_CATEGORIES.FOOD,
    station: STATIONS.KUECHE,
    sortOrder: 120,
    isActive: true,
    searchTerms: ['pommes', 'fritten'],
  },
  {
    key: 'bratwurst',
    label: 'Bratwurst',
    category: ITEM_CATEGORIES.FOOD,
    station: STATIONS.KUECHE,
    sortOrder: 130,
    isActive: true,
    searchTerms: ['bratwurst', 'wurst'],
  },
  {
    key: 'kaesebrot',
    label: 'Käsebrot',
    category: ITEM_CATEGORIES.FOOD,
    station: STATIONS.KUECHE,
    sortOrder: 140,
    isActive: true,
    searchTerms: ['kaesebrot', 'käse', 'brot'],
  },
]);

module.exports = {
  DEFAULT_CATALOG_CATEGORIES,
  DEFAULT_CATALOG_ITEMS,
};
