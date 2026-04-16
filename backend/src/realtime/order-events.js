function createOrderEvents({ io }) {
  return {
    publishOrderChanged(change) {
      io.emit('orders:changed', {
        orderId: change.orderId,
        type: change.type,
      });
    },
  };
}

module.exports = {
  createOrderEvents,
};
