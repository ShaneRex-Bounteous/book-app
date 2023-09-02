var DataTypes = require("sequelize").DataTypes;
var _author = require("./author");
var _book = require("./book");
var _user = require("./user");

function initModels(sequelize) {
  var author = _author(sequelize, DataTypes);
  var book = _book(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  book.belongsTo(author, { as: "author", foreignKey: "author_id"});
  author.hasMany(book, { as: "books", foreignKey: "author_id"});

  return {
    author,
    book,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
