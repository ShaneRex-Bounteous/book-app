const { Sequelize } = require('sequelize');
const initModels = require("../models/init-models");

const sequelize = new Sequelize(process.env.DB, process.env.DBUSER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: "postgres",
});
let models = initModels(sequelize);

module.exports = { sequelize, models };