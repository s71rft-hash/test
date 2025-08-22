'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const password = await bcrypt.hash('password123', 8);
    await queryInterface.bulkInsert('Users', [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        password: password,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Regular User',
        email: 'user@example.com',
        password: password,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    await queryInterface.bulkInsert('Realms', [
      {
        id: 1,
        name: 'default',
        description: 'Default realm',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    await queryInterface.bulkInsert('Roles', [
      {
        id: 1,
        name: 'admin',
        description: 'Admin role',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'user',
        description: 'User role',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    await queryInterface.bulkInsert('UserRealmRoles', [
      {
        userId: 1,
        realmId: 1,
        roleId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        realmId: 1,
        roleId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('UserRealmRoles', null, {});
    await queryInterface.bulkDelete('Roles', null, {});
    await queryInterface.bulkDelete('Realms', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
