export function buildOrderPayload({ draftItems, initialNote, tableNumber }) {
  return {
    tableNumber,
    initialNote,
    items: draftItems.map(
      ({ catalogItemKey, category: itemCategory, name, quantity: itemQuantity }) => ({
        catalogItemKey: catalogItemKey || null,
        name,
        quantity: itemQuantity,
        category: itemCategory,
      }),
    ),
  }
}
