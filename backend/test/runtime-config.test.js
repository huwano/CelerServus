const test = require('node:test');
const assert = require('node:assert/strict');

const {
  getBackendPort,
  getCorsConfig,
  getFrontendOrigin,
  getSessionCookieConfig,
  getSessionSecret,
  getStorageMode,
} = require('../src/config/runtime');

test('getBackendPort respects explicit env overrides', () => {
  assert.equal(getBackendPort({ PORT: '4010' }), 4010);
  assert.equal(getBackendPort({ BACKEND_PORT: '4020' }), 4020);
  assert.equal(getBackendPort({}), 3000);
});

test('getFrontendOrigin prefers FRONTEND_ORIGIN and otherwise builds from FRONTEND_PORT', () => {
  assert.equal(
    getFrontendOrigin({ FRONTEND_ORIGIN: 'http://localhost:6000' }),
    'http://localhost:6000',
  );
  assert.equal(getFrontendOrigin({ FRONTEND_PORT: '5180' }), 'http://localhost:5180');
  assert.equal(getFrontendOrigin({}), 'http://localhost:5173');
});

test('getStorageMode prefers explicit mode and otherwise derives from DATABASE_URL', () => {
  assert.equal(getStorageMode({ BACKEND_STORAGE_MODE: 'memory' }), 'memory');
  assert.equal(getStorageMode({ BACKEND_STORAGE_MODE: 'postgres' }), 'postgres');
  assert.equal(getStorageMode({ DATABASE_URL: 'postgres://db' }), 'postgres');
  assert.equal(getStorageMode({}), 'memory');
  assert.throws(() => getStorageMode({ BACKEND_STORAGE_MODE: 'sqlite' }), /Unsupported/);
});

test('getSessionSecret requires explicit secrets in production only', () => {
  assert.equal(getSessionSecret({ SESSION_SECRET: 'top-secret' }), 'top-secret');
  assert.equal(getSessionSecret({ NODE_ENV: 'development' }), 'dev-secret-change-this');
  assert.throws(
    () => getSessionSecret({ NODE_ENV: 'production' }),
    /SESSION_SECRET is required/,
  );
});

test('getSessionCookieConfig derives secure and sameSite defaults from env', () => {
  assert.deepEqual(getSessionCookieConfig({}), {
    secure: false,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24,
  });

  assert.deepEqual(getSessionCookieConfig({ NODE_ENV: 'production' }), {
    secure: true,
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24,
  });

  assert.deepEqual(
    getSessionCookieConfig({
      SESSION_COOKIE_SECURE: 'false',
      SESSION_COOKIE_SAME_SITE: 'strict',
    }),
    {
      secure: false,
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24,
    },
  );
});

test('getCorsConfig enables credentials for the configured frontend origin', () => {
  assert.deepEqual(getCorsConfig({ FRONTEND_ORIGIN: 'http://localhost:5174' }), {
    origin: 'http://localhost:5174',
    credentials: true,
  });
});
