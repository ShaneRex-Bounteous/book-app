const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Author = sequelize.define('author', {
    first_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    last_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    biography: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    birth_year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    death_year: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    nationality: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'author',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "author_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });

  return Author
};
