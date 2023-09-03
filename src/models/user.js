const Sequelize = require('sequelize');
const { hashPassword } = require('../utils/PasswordUtils')
module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('user', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: {
        args: "user_email_key",
        msg: "Email already exists"
      }
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    role: {
      type: DataTypes.STRING(10),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'user',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "user_email_key",
        unique: true,
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "user_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ],
    hooks: {
      beforeCreate: async (user) => {
        user.password = await hashPassword(user.password)
      }
    }
  });

  return User
};
