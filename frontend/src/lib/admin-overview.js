export const ADMIN_ORDER_STATUS_KEYS = ['open', 'in_progress', 'completed', 'cancelled']

function toNumber(value) {
  return Number(value || 0)
}

export function buildAdminOverviewMetrics(overview = {}) {
  const ordersByStatus = overview.ordersByStatus || {}
  const activeItemsByStation = overview.activeItemsByStation || {}
  const usersByRole = overview.usersByRole || {}

  return {
    totalOrders: Object.values(ordersByStatus).reduce((sum, count) => sum + toNumber(count), 0),
    activeOrders: toNumber(ordersByStatus.open) + toNumber(ordersByStatus.in_progress),
    completedOrders: toNumber(ordersByStatus.completed),
    busyTables: toNumber(overview.busyTables),
    totalUsers: toNumber(overview.totalUsers),
    totalMessages: toNumber(overview.totalMessages),
    activeBarItems: toNumber(activeItemsByStation.theke),
    activeKitchenItems: toNumber(activeItemsByStation.kueche),
    waiterCount: toNumber(usersByRole.bedienung),
  }
}
