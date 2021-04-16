require('dotenv').config();
const { config } = require('.');

module.exports = {
  development: config.db,
  test: config.db,
  production: config.db
};
