export function formatCents(value) {
  const amount = Number.isFinite(value) ? value : 0
  const isNegative = amount < 0
  const absolute = Math.abs(Math.trunc(amount))
  const euros = Math.floor(absolute / 100)
  const cents = String(absolute % 100).padStart(2, '0')
  return `${isNegative ? '-' : ''}${euros},${cents} EUR`
}

export function calculateDraftTotals(draftItems = [], pricingByKey = {}) {
  return draftItems.reduce(
    (totals, item) => {
      const pricing = pricingByKey[item.catalogItemKey] || {}
      const quantity = Number(item.quantity || 0)
      const unitPriceCents = Number(pricing.priceCents || 0)
      const unitDepositCents = Number(pricing.depositCents || 0)

      totals.itemsCents += unitPriceCents * quantity
      totals.depositCents += unitDepositCents * quantity
      totals.quantity += quantity
      return totals
    },
    {
      itemsCents: 0,
      depositCents: 0,
      totalCents: 0,
      quantity: 0,
    },
  )
}

export function finalizeDraftTotals(totals) {
  const normalizedTotals = {
    itemsCents: Number(totals?.itemsCents || 0),
    depositCents: Number(totals?.depositCents || 0),
    quantity: Number(totals?.quantity || 0),
  }

  return {
    ...normalizedTotals,
    totalCents: normalizedTotals.itemsCents + normalizedTotals.depositCents,
  }
}

export function calculateChange(totalCents, paidCents) {
  const normalizedTotalCents = Number(totalCents || 0)
  const normalizedPaidCents = Number(paidCents || 0)

  const dueCents = Math.max(0, normalizedTotalCents - normalizedPaidCents)
  const changeCents = Math.max(0, normalizedPaidCents - normalizedTotalCents)

  return {
    dueCents,
    changeCents,
  }
}

