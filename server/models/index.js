const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const { database, username, password, host, dialect } = config[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
  logging: process.env.NODE_ENV === 'development',
  define: {
    freezeTableName: true,
  },
});

const models = {};
const modelFiles = fs.readdirSync(__dirname).filter((file) => file !== 'index.js');

modelFiles.forEach((file) => {
  const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
  models[model.name] = model;
});

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = { sequelize, Sequelize, models };