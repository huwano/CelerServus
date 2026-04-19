function getBackendPort(env = process.env) {
  return Number(env.PORT || env.BACKEND_PORT || 3000);
}

function getFrontendOrigin(env = process.env) {
  if (env.FRONTEND_ORIGIN) {
    return env.FRONTEND_ORIGIN;
  }

  return `http://localhost:${env.FRONTEND_PORT || 5173}`;
}

function parseBoolean(value) {
  if (value === undefined) {
    return undefined;
  }

  return value === 'true';
}

function getStorageMode(env = process.env) {
  if (env.BACKEND_STORAGE_MODE) {
    const normalizedMode = String(env.BACKEND_STORAGE_MODE).trim().toLowerCase();

    if (normalizedMode === 'memory' || normalizedMode === 'postgres') {
      return normalizedMode;
    }

    throw new Error(
      `Unsupported BACKEND_STORAGE_MODE "${env.BACKEND_STORAGE_MODE}". Expected "memory" or "postgres".`,
    );
  }

  return env.DATABASE_URL ? 'postgres' : 'memory';
}

function getSessionSecret(env = process.env) {
  if (env.SESSION_SECRET) {
    return env.SESSION_SECRET;
  }

  if (env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET is required when NODE_ENV=production');
  }

  return 'dev-secret-change-this';
}

function getSessionCookieConfig(env = process.env) {
  const secure = parseBoolean(env.SESSION_COOKIE_SECURE) ?? env.NODE_ENV === 'production';
  const sameSite = env.SESSION_COOKIE_SAME_SITE || (secure ? 'none' : 'lax');

  return {
    secure,
    httpOnly: true,
    sameSite,
    maxAge: 1000 * 60 * 60 * 24,
  };
}

function getCorsConfig(env = process.env) {
  return {
    origin: getFrontendOrigin(env),
    credentials: true,
  };
}

module.exports = {
  getBackendPort,
  getCorsConfig,
  getFrontendOrigin,
  getSessionCookieConfig,
  getSessionSecret,
  getStorageMode,
};
