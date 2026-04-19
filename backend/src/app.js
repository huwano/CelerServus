const cors = require('cors');
const express = require('express');
const session = require('express-session');
const http = require('http');
const { Server } = require('socket.io');
const {
  getCorsConfig,
  getFrontendOrigin,
  getSessionCookieConfig,
  getSessionSecret,
} = require('./config/runtime');
const { HttpError } = require('./http-error');

function createApp(env = process.env) {
  const app = express();

  app.use(cors(getCorsConfig(env)));
  app.use(express.json());
  app.set('trust proxy', 1);
  app.use(
    session({
      name: 'sid',
      secret: getSessionSecret(env),
      resave: false,
      saveUninitialized: false,
      cookie: getSessionCookieConfig(env),
    }),
  );

  return app;
}

function createRealtimeServer(app, env = process.env) {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: getFrontendOrigin(env),
      credentials: true,
      methods: ['GET', 'POST'],
    },
  });

  return { io, server };
}

function registerErrorHandler(app) {
  app.use((error, _req, res, _next) => {
    if (error instanceof HttpError) {
      return res.status(error.statusCode).json({
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      });
    }

    console.error(error);

    return res.status(500).json({
      error: {
        code: 'internal_server_error',
        message: 'Unexpected server error',
        details: null,
      },
    });
  });
}

module.exports = {
  createApp,
  createRealtimeServer,
  registerErrorHandler,
};
