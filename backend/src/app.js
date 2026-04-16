const cors = require('cors');
const express = require('express');
const session = require('express-session');
const http = require('http');
const { Server } = require('socket.io');
const { HttpError } = require('./http-error');

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.set('trust proxy', 1);
  app.use(
    session({
      name: 'sid',
      secret: process.env.SESSION_SECRET || 'dev-secret-change-this',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24,
      },
    }),
  );

  return app;
}

function createRealtimeServer(app) {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
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
