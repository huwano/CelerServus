const test = require('node:test');
const assert = require('node:assert/strict');

const { createSessionsController } = require('../src/controllers/sessions-controller');
const { InMemoryUserRepository } = require('../src/repositories/in-memory-user-repository');
const { SessionService } = require('../src/services/session-service');
const { createMockResponse, createNextCollector } = require('./helpers/mock-http');

function createController() {
  const service = new SessionService({ userRepository: new InMemoryUserRepository() });
  return createSessionsController({ sessionService: service });
}

test('createSession responds with 201 and stores the canonical role in the session', () => {
  const controller = createController();
  const req = {
    body: { username: 'kellner1', password: 'test123' },
    session: {},
  };
  const res = createMockResponse();
  const { calls, next } = createNextCollector();

  controller.createSession(req, res, next);

  assert.equal(calls.length, 0);
  assert.equal(res.statusCode, 201);
  assert.equal(req.session.user.role, 'bedienung');
  assert.equal(res.body.data.user.role, 'bedienung');
});

test('createLegacySession maps canonical roles back to the legacy frontend shape', () => {
  const controller = createController();
  const req = {
    body: { username: 'kellner1', password: 'test123' },
    session: {},
  };
  const res = createMockResponse();
  const { calls, next } = createNextCollector();

  controller.createLegacySession(req, res, next);

  assert.equal(calls.length, 0);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.user.role, 'waiter');
});

test('createSession forwards validation errors for incomplete payloads', () => {
  const controller = createController();
  const req = {
    body: { username: '   ' },
    session: {},
  };
  const res = createMockResponse();
  const { calls, next } = createNextCollector();

  controller.createSession(req, res, next);

  assert.equal(calls.length, 1);
  assert.equal(calls[0].statusCode, 400);
  assert.equal(calls[0].code, 'validation_error');
});
