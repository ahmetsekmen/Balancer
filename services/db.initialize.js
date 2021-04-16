const models = require('../models');

module.exports = (app) => {
  app.set('sequelize', models.sequelize);
  app.set('models', models.sequelize.models);

  models.sequelize.sync()
    .then(() => console.log('Sequelize synced'))
    .catch((error) => {
      console.log(`Sequelize sync failed: ${error.message}`);
    });
};
