'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserRealmRoles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      realmId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Realms',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      roleId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Roles',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addConstraint('UserRealmRoles', {
      fields: ['userId', 'realmId', 'roleId'],
      type: 'unique',
      name: 'user_realm_role_unique_constraint'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('UserRealmRoles', 'user_realm_role_unique_constraint');
    await queryInterface.dropTable('UserRealmRoles');
  }
};