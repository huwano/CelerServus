const PERMISSIONS = Object.freeze({
  ORDER_CREATE_OWN: 'order:create:own',
  ORDER_VIEW_OWN: 'order:view:own',
  ORDER_UPDATE_OWN: 'order:update:own',
  ORDER_CANCEL_OWN: 'order:cancel:own',
  ORDER_ADD_MESSAGE_OWN: 'order:add-message:own',
  ORDER_VIEW_OWN_NOTES: 'order:view-notes:own',
  ORDER_VIEW_DRINK_STATION: 'order:view:station:theke',
  ORDER_UPDATE_DRINK_STATUS: 'order:update-status:station:theke',
  ORDER_VIEW_FOOD_STATION: 'order:view:station:kueche',
  ORDER_UPDATE_FOOD_STATUS: 'order:update-status:station:kueche',
  ORDER_VIEW_ALL: 'order:view:all',
  ORDER_UPDATE_ALL: 'order:update:all',
  USER_MANAGE: 'user:manage',
  ROLE_MANAGE: 'role:manage',
  PERMISSION_MANAGE: 'permission:manage',
});

const DEFAULT_ROLE_PERMISSIONS = Object.freeze({
  bedienung: [
    PERMISSIONS.ORDER_CREATE_OWN,
    PERMISSIONS.ORDER_VIEW_OWN,
    PERMISSIONS.ORDER_UPDATE_OWN,
    PERMISSIONS.ORDER_CANCEL_OWN,
    PERMISSIONS.ORDER_ADD_MESSAGE_OWN,
    PERMISSIONS.ORDER_VIEW_OWN_NOTES,
  ],
  theke: [
    PERMISSIONS.ORDER_VIEW_DRINK_STATION,
    PERMISSIONS.ORDER_UPDATE_DRINK_STATUS,
  ],
  kueche: [
    PERMISSIONS.ORDER_VIEW_FOOD_STATION,
    PERMISSIONS.ORDER_UPDATE_FOOD_STATUS,
  ],
  admin: Object.freeze(Object.values(PERMISSIONS)),
});

const DEFAULT_ROLE_CONFIG = Object.freeze({
  overrides: Object.freeze({}),
});

function createRolePermissionMap(overrides = DEFAULT_ROLE_CONFIG.overrides) {
  return Object.fromEntries(
    Object.entries(DEFAULT_ROLE_PERMISSIONS).map(([role, permissions]) => {
      const permissionSet = new Set(permissions);
      const roleOverrides = overrides[role] || {};

      for (const [permission, enabled] of Object.entries(roleOverrides)) {
        if (enabled) {
          permissionSet.add(permission);
          continue;
        }

        permissionSet.delete(permission);
      }

      return [role, permissionSet];
    }),
  );
}

module.exports = {
  DEFAULT_ROLE_CONFIG,
  DEFAULT_ROLE_PERMISSIONS,
  PERMISSIONS,
  createRolePermissionMap,
};
