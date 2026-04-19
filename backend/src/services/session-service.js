const { HttpError } = require('../http-error');
const { assertPlainObject, requireTrimmedString } = require('../validation');

class SessionService {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async authenticate(payload) {
    assertPlainObject(payload, 'Invalid session payload');

    const username = requireTrimmedString(payload.username, 'username', 'Username is required');
    const password = requireTrimmedString(payload.password, 'password', 'Password is required');
    const user = await this.userRepository.findByCredentials(username, password);

    if (!user) {
      throw new HttpError(401, 'invalid_credentials', 'Invalid credentials');
    }

    return {
      id: user.id,
      username: user.username,
      role: user.role,
    };
  }
}

module.exports = {
  SessionService,
};
