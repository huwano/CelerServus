const { loadBackendEnv } = require('./src/env');
const { createApp, createRealtimeServer, registerErrorHandler } = require('./src/app');
const { bootstrapRepositories } = require('./src/bootstrap');
const { getBackendPort } = require('./src/config/runtime');
const { createCatalogController } = require('./src/controllers/catalog-controller');
const { createOrdersController } = require('./src/controllers/orders-controller');
const { createSessionsController } = require('./src/controllers/sessions-controller');
const { createStatisticsController } = require('./src/controllers/statistics-controller');
const { createOrderEvents } = require('./src/realtime/order-events');
const { createCatalogRouter } = require('./src/routes/catalog-routes');
const { createOrdersRouter } = require('./src/routes/orders-routes');
const { createSessionsRouter } = require('./src/routes/sessions-routes');
const { createStatisticsRouter } = require('./src/routes/statistics-routes');
const { CatalogService } = require('./src/services/catalog-service');
const { OrderService } = require('./src/services/order-service');
const { SessionService } = require('./src/services/session-service');
const { StatisticsService } = require('./src/services/statistics-service');

loadBackendEnv();

async function main() {
  const repositories = await bootstrapRepositories();
  const app = createApp();
  const { io, server } = createRealtimeServer(app);

  const orderEvents = createOrderEvents({ io });

  const sessionService = new SessionService({ userRepository: repositories.userRepository });
  const catalogService = new CatalogService({ catalogRepository: repositories.catalogRepository });
  const orderService = new OrderService({
    orderRepository: repositories.orderRepository,
    catalogRepository: repositories.catalogRepository,
  });
  const statisticsService = new StatisticsService({
    orderRepository: repositories.orderRepository,
    userRepository: repositories.userRepository,
  });

  const sessionsController = createSessionsController({ sessionService });
  const catalogController = createCatalogController({ catalogService });
  const ordersController = createOrdersController({ orderService, orderEvents });
  const statisticsController = createStatisticsController({ statisticsService });

  app.use(createSessionsRouter({ sessionsController }));
  app.use(createCatalogRouter({ catalogController }));
  app.use(createOrdersRouter({ ordersController }));
  app.use(createStatisticsRouter({ statisticsController }));
  registerErrorHandler(app);

  io.on('connection', (socket) => {
    console.log('Ein Client ist verbunden');
    socket.on('disconnect', () => console.log('Client getrennt'));
  });

  const PORT = getBackendPort();

  server.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
  });

  async function shutdown() {
    await repositories.close();
    server.close(() => process.exit(0));
  }

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
