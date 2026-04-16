const {
  DEFAULT_ROLE_CONFIG,
  createRolePermissionMap,
} = require('../config/role-permissions');

function getPermissionsForRole(role, overrides = DEFAULT_ROLE_CONFIG.overrides) {
  const permissionMap = createRolePermissionMap(overrides);

  return permissionMap[role] || new Set();
}

function hasPermission(role, permission, overrides = DEFAULT_ROLE_CONFIG.overrides) {
  return getPermissionsForRole(role, overrides).has(permission);
}

module.exports = {
  getPermissionsForRole,
  hasPermission,
};
