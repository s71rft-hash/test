'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserRealmRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserRealmRole.belongsTo(models.User, { foreignKey: 'userId' });
      UserRealmRole.belongsTo(models.Realm, { foreignKey: 'realmId' });
      UserRealmRole.belongsTo(models.Role, { foreignKey: 'roleId' });
    }
  }
  UserRealmRole.init({
    userId: DataTypes.INTEGER,
    realmId: DataTypes.INTEGER,
    roleId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserRealmRole',
  });
  return UserRealmRole;
};