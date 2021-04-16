const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  const balancer_token = sequelize.define('balancer_token', {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true
    },
    tokenId: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '0x0'
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '0x0'
    },
    balance: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '0.0'
    },
    decimals: {
      type: Sequelize.INTEGER,
      defaultValue: 18
    },
    denormWeight: {
      type: Sequelize.STRING,
      defaultValue: '0'
    },
    symbol: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ''
    },
  }, {
    timestamp: true
  });

  balancer_token.upsert = (values, condition) => (
    balancer_token.findOne({ where: condition })
      .then((obj) => {
        if (obj) {
          return obj.update(values);
        }
        return balancer_token.create(values);
      })
  );

  return balancer_token;
};
