const ROLE_META = {
  bedienung: {
    label: 'Bedienung',
    shortLabel: 'Service',
    description: 'Bestellungen, Tische und Stationsnachrichten',
  },
  theke: {
    label: 'Theke',
    shortLabel: 'Bar',
    description: 'Getränke im Fluss halten',
  },
  kueche: {
    label: 'Küche',
    shortLabel: 'Pass',
    description: 'Speisen priorisieren und fertig melden',
  },
  admin: {
    label: 'Admin',
    shortLabel: 'Leitstand',
    description: 'Gesamtüberblick über alle Stationen',
  },
}

const NAVIGATION_BY_ROLE = {
  bedienung: [
    {
      to: '/bedienung',
      label: 'Service Hub',
      caption: 'Bestellungen aufnehmen',
    },
  ],
  theke: [
    {
      to: '/theke',
      label: 'Getränke-Board',
      caption: 'Status an der Theke steuern',
    },
  ],
  kueche: [
    {
      to: '/kueche',
      label: 'Küchenpass',
      caption: 'Speisen priorisieren',
    },
  ],
  admin: [
    {
      to: '/admin',
      label: 'Leitstand',
      caption: 'Alle Stationen im Blick',
    },
  ],
}

export function getRoleMeta(role) {
  return (
    ROLE_META[role] || {
      label: 'CelerServus',
      shortLabel: 'App',
      description: 'Serviceoberfläche',
    }
  )
}

export function getNavigationForRole(role) {
  return NAVIGATION_BY_ROLE[role] || []
}
