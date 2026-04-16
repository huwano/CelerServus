const ROLES = Object.freeze({
  BEDIENUNG: 'bedienung',
  THEKE: 'theke',
  KUECHE: 'kueche',
  ADMIN: 'admin',
});

const ROLE_ALIASES = Object.freeze({
  waiter: ROLES.BEDIENUNG,
  bedienung: ROLES.BEDIENUNG,
  bar: ROLES.THEKE,
  theke: ROLES.THEKE,
  kitchen: ROLES.KUECHE,
  kueche: ROLES.KUECHE,
  admin: ROLES.ADMIN,
});

const LEGACY_ROLE_BY_ROLE = Object.freeze({
  [ROLES.BEDIENUNG]: 'waiter',
  [ROLES.THEKE]: 'theke',
  [ROLES.KUECHE]: 'kitchen',
  [ROLES.ADMIN]: 'admin',
});

function normalizeRole(role) {
  return ROLE_ALIASES[role] || role;
}

function toLegacyRole(role) {
  return LEGACY_ROLE_BY_ROLE[role] || role;
}

module.exports = {
  ROLES,
  normalizeRole,
  toLegacyRole,
};
