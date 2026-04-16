function createMockResponse() {
  return {
    statusCode: 200,
    body: null,
    ended: false,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    end() {
      this.ended = true;
      return this;
    },
    clearCookie() {
      return this;
    },
  };
}

function createNextCollector() {
  const calls = [];

  return {
    calls,
    next(error) {
      calls.push(error);
    },
  };
}

module.exports = {
  createMockResponse,
  createNextCollector,
};
