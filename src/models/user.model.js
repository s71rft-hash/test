const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.UserRealmRole, { foreignKey: 'userId' });
    }

    static async isEmailTaken(email) {
      const user = await this.findOne({ where: { email } });
      return !!user;
    }

    async isPasswordMatch(password) {
      return bcrypt.compare(password, this.password);
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
      hooks: {
        async beforeSave(user) {
          if (user.changed('password')) {
            user.password = await bcrypt.hash(user.password, 8);
          }
        },
      },
      defaultScope: {
        attributes: {
          exclude: ['password'],
        },
      },
    }
  );

  return User;
};
