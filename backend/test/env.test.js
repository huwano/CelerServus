const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { loadBackendEnv, parseEnvFile } = require('../src/env');

test('parseEnvFile parses simple key value pairs', () => {
  const parsed = parseEnvFile(`
DATABASE_URL=postgres://user:pass@localhost:5432/celerservus
SESSION_SECRET="top-secret"
# comment
PORT=3000
  `);

  assert.equal(parsed.DATABASE_URL, 'postgres://user:pass@localhost:5432/celerservus');
  assert.equal(parsed.SESSION_SECRET, 'top-secret');
  assert.equal(parsed.PORT, '3000');
});

test('loadBackendEnv reads backend/.env style files without overwriting existing env vars', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'celerservus-env-'));
  const envFilePath = path.join(tempDir, '.env');

  fs.writeFileSync(
    envFilePath,
    'DATABASE_URL=postgres://local:test@localhost:5432/celerservus\nSESSION_SECRET=secret\n',
  );

  const originalDatabaseUrl = process.env.DATABASE_URL;
  const originalSessionSecret = process.env.SESSION_SECRET;

  process.env.DATABASE_URL = 'postgres://already:set@localhost:5432/existing';
  delete process.env.SESSION_SECRET;

  loadBackendEnv({ envFilePath });

  assert.equal(process.env.DATABASE_URL, 'postgres://already:set@localhost:5432/existing');
  assert.equal(process.env.SESSION_SECRET, 'secret');

  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }

  if (originalSessionSecret === undefined) {
    delete process.env.SESSION_SECRET;
  } else {
    process.env.SESSION_SECRET = originalSessionSecret;
  }

  fs.rmSync(tempDir, { recursive: true, force: true });
});
