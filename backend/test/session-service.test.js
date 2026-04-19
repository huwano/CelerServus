const test = require('node:test');
const assert = require('node:assert/strict');

const { InMemoryUserRepository } = require('../src/repositories/in-memory-user-repository');
const { SessionService } = require('../src/services/session-service');

test('authenticate rejects missing credentials as validation errors', async () => {
  const service = new SessionService({ userRepository: new InMemoryUserRepository() });

  await assert.rejects(
    () => service.authenticate({ username: '   ' }),
    (error) =>
      error.statusCode === 400 &&
      error.code === 'validation_error' &&
      error.details?.field === 'username',
  );
});
