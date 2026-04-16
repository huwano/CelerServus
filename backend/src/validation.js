const { HttpError } = require('./http-error');

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function createValidationError(message, details = null) {
  return new HttpError(400, 'validation_error', message, details);
}

function assertPlainObject(value, message = 'Invalid request payload') {
  if (!isPlainObject(value)) {
    throw createValidationError(message);
  }
}

function requireTrimmedString(value, field, message = `${field} is required`) {
  if (typeof value !== 'string' || !value.trim()) {
    throw createValidationError(message, { field });
  }

  return value.trim();
}

function normalizeOptionalTrimmedString(value, field) {
  if (value === undefined || value === null) {
    return '';
  }

  if (typeof value !== 'string') {
    throw createValidationError(`${field} must be a string`, { field });
  }

  return value.trim();
}

function toValidationError(error, fallbackMessage = 'Invalid request payload') {
  if (error instanceof HttpError) {
    return error;
  }

  return createValidationError(error?.message || fallbackMessage);
}

module.exports = {
  assertPlainObject,
  createValidationError,
  normalizeOptionalTrimmedString,
  requireTrimmedString,
  toValidationError,
};
