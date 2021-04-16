const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  const balancer_pool = sequelize.define('balancer_pool', {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true
    },
    poolId: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '0x0'
    },
    finalized: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    publicSwap: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    swapFee: {
      type: Sequelize.STRING,
      defaultValue: '0.0'
    },
    totalWeight: {
      type: Sequelize.STRING,
      defaultValue: '0.0'
    },
  }, {
    timestamp: true
  });

  balancer_pool.upsert = (values, condition) => (
    balancer_pool.findOne({ where: condition })
      .then((obj) => {
        if (obj) {
          return obj.update(values);
        }
        return balancer_pool.create(values);
      })
  );

  return balancer_pool;
};
