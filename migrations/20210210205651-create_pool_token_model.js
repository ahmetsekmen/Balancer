module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('balancer_poolTokens', {
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
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('balancer_poolTokens');
  }
};
