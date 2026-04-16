const { ROLES } = require('../config/roles');

const DEFAULT_DEMO_USERS = Object.freeze([
  { id: 'user-1', username: 'kellner1', password: 'test123', role: ROLES.BEDIENUNG },
  { id: 'user-2', username: 'theke1', password: 'test123', role: ROLES.THEKE },
  { id: 'user-3', username: 'kueche1', password: 'test123', role: ROLES.KUECHE },
  { id: 'user-4', username: 'admin1', password: 'test123', role: ROLES.ADMIN },
]);

class InMemoryUserRepository {
  constructor(users = DEFAULT_DEMO_USERS) {
    this.users = [...users];
  }

  findByCredentials(username, password) {
    return (
      this.users.find((user) => user.username === username && user.password === password) || null
    );
  }
}

module.exports = {
  DEFAULT_DEMO_USERS,
  InMemoryUserRepository,
};
