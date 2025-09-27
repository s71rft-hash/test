const bcrypt = require('bcryptjs');

module.exports = {
  async beforeSave(user) {
    if (user.changed('password')) {
      user.password = await bcrypt.hash(user.password, 8);
    }
  },
  afterCreate(user) {
    console.log(`A new user was created: ${user.toJSON()}`);
  },
  afterUpdate(user) {
    console.log(`A user was updated: ${user.toJSON()}`);
  },
  afterDestroy(user) {
    console.log(`A user was deleted: ${user.toJSON()}`);
  },
};