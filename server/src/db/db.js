const { Sequelize } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config')[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

sequelize.authenticate()
  .then(() => console.log('✅ Sequelize connected to MySQL'))
  .catch((err) => console.error('❌ Connection error:', err));

module.exports = sequelize;