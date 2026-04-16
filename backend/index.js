const {
  createApp,
  createRealtimeServer,
  registerErrorHandler,
} = require('./src/app');
const { createOrdersController } = require('./src/controllers/orders-controller');
const { createSessionsController } = require('./src/controllers/sessions-controller');
const { InMemoryOrderRepository } = require('./src/repositories/in-memory-order-repository');
const { InMemoryUserRepository } = require('./src/repositories/in-memory-user-repository');
const { createOrderEvents } = require('./src/realtime/order-events');
const { createOrdersRouter } = require('./src/routes/orders-routes');
const { createSessionsRouter } = require('./src/routes/sessions-routes');
const { OrderService } = require('./src/services/order-service');
const { SessionService } = require('./src/services/session-service');

const app = createApp();
const { io, server } = createRealtimeServer(app);

const userRepository = new InMemoryUserRepository();
const orderRepository = new InMemoryOrderRepository();
const orderEvents = createOrderEvents({ io });

const sessionService = new SessionService({ userRepository });
const orderService = new OrderService({ orderRepository });

const sessionsController = createSessionsController({ sessionService });
const ordersController = createOrdersController({ orderService, orderEvents });

app.use(createSessionsRouter({ sessionsController }));
app.use(createOrdersRouter({ ordersController }));
registerErrorHandler(app);

io.on('connection', (socket) => {
  console.log('Ein Client ist verbunden');
  socket.on('disconnect', () => console.log('Client getrennt'));
});

const PORT = Number(process.env.PORT) || 3000;

server.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
