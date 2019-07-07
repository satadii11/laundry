const bcrypt = require('bcrypt');

const SALT_ROUND = 10;

module.exports = {
  async hashPassword(password) {
    return await bcrypt.hash(password, SALT_ROUND);
  },

  async compare(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
};
