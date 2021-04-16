const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  const balancer_poolToken = sequelize.define('balancer_poolToken', {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true
    },
    poolId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'balancer_pools',
        key: 'id'
      }
    },
    tokenId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'balancer_tokens',
        key: 'id'
      }
    },
  }, {
    timestamp: true
  });

  balancer_poolToken.upsert = (values, condition) => (
    balancer_poolToken.findOne({ where: condition })
      .then((obj) => {
        if (obj) {
          return obj.update(values);
        }
        return balancer_poolToken.create(values);
      })
  );

  balancer_poolToken.associate = function (models) {
    this.belongsTo(models.balancer_pool, {
      foreignKey: {
        name: 'poolId',
        allowNull: false
      },
    });
    this.belongsTo(models.balancer_token, {
      foreignKey: {
        name: 'tokenId',
        allowNull: false
      },
    });
  };

  return balancer_poolToken;
};
