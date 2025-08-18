'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const password = await bcrypt.hash('password123', 8);
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: password,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Regular User',
        email: 'user@example.com',
        password: password,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
