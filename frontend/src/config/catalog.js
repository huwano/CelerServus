export const defaultCatalogConfig = {
  categories: [
    {
      key: 'drink',
      label: 'Getränk',
      station: 'theke',
    },
    {
      key: 'food',
      label: 'Speise',
      station: 'kueche',
    },
  ],
  items: [
    {
      key: 'riesling-schorle',
      label: 'Riesling Schorle',
      category: 'drink',
      searchTerms: ['wein', 'schorle', 'riesling'],
    },
    {
      key: 'apfelschorle',
      label: 'Apfelschorle',
      category: 'drink',
      searchTerms: ['apfel', 'schorle', 'saft'],
    },
    {
      key: 'wasser',
      label: 'Wasser',
      category: 'drink',
      searchTerms: ['still', 'sprudel', 'wasser'],
    },
    {
      key: 'sekt',
      label: 'Sekt',
      category: 'drink',
      searchTerms: ['sekt', 'schaumwein'],
    },
    {
      key: 'flammkuchen-klassik',
      label: 'Flammkuchen Klassik',
      category: 'food',
      searchTerms: ['flammkuchen', 'klassik', 'speck'],
    },
    {
      key: 'pommes',
      label: 'Pommes',
      category: 'food',
      searchTerms: ['pommes', 'fritten'],
    },
    {
      key: 'bratwurst',
      label: 'Bratwurst',
      category: 'food',
      searchTerms: ['bratwurst', 'wurst'],
    },
    {
      key: 'kaesebrot',
      label: 'Käsebrot',
      category: 'food',
      searchTerms: ['kaesebrot', 'käse', 'brot'],
    },
  ],
}
