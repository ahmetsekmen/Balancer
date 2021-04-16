const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  const balancer_tokenPrice = sequelize.define('balancer_tokenPrice', {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '0x0'
    },
    decimals: {
      type: Sequelize.INTEGER,
      defaultValue: 18
    },
    symbol: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ''
    },
    ethToTokenPrice: {
      type: Sequelize.STRING,
      defaultValue: '0.0'
    },
    tokenToEthPrice: {
      type: Sequelize.STRING,
      defaultValue: '0.0'
    },
  }, {
    timestamp: true
  });

  balancer_tokenPrice.upsert = (values, condition) => (
    balancer_tokenPrice.findOne({ where: condition })
      .then((obj) => {
        if (obj) {
          return obj.update(values);
        }
        return balancer_tokenPrice.create(values);
      })
  );

  return balancer_tokenPrice;
};
