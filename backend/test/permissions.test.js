const test = require('node:test');
const assert = require('node:assert/strict');

const {
  PERMISSIONS,
  createRolePermissionMap,
} = require('../src/config/role-permissions');
const { getPermissionsForRole, hasPermission } = require('../src/domain/permissions');

test('standard roles receive the expected default permissions', () => {
  const permissions = getPermissionsForRole('bedienung');

  assert.equal(permissions.has(PERMISSIONS.ORDER_CREATE_OWN), true);
  assert.equal(permissions.has(PERMISSIONS.ORDER_ADD_MESSAGE_OWN), true);
  assert.equal(permissions.has(PERMISSIONS.USER_MANAGE), false);
});

test('admin has access to all default permissions', () => {
  const permissions = getPermissionsForRole('admin');

  assert.equal(permissions.has(PERMISSIONS.ORDER_VIEW_ALL), true);
  assert.equal(permissions.has(PERMISSIONS.PERMISSION_MANAGE), true);
});

test('role permissions can be disabled or enabled through overrides', () => {
  const overrides = {
    bedienung: {
      [PERMISSIONS.ORDER_UPDATE_OWN]: false,
      [PERMISSIONS.ORDER_VIEW_ALL]: true,
    },
  };
  const permissionMap = createRolePermissionMap(overrides);

  assert.equal(permissionMap.bedienung.has(PERMISSIONS.ORDER_UPDATE_OWN), false);
  assert.equal(permissionMap.bedienung.has(PERMISSIONS.ORDER_VIEW_ALL), true);
});

test('hasPermission uses the configured overrides', () => {
  const overrides = {
    bedienung: {
      [PERMISSIONS.ORDER_UPDATE_OWN]: false,
    },
  };

  assert.equal(hasPermission('bedienung', PERMISSIONS.ORDER_UPDATE_OWN, overrides), false);
  assert.equal(hasPermission('bedienung', PERMISSIONS.ORDER_CREATE_OWN, overrides), true);
});
