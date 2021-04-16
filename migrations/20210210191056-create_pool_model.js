module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('balancer_pools', {
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
    return queryInterface.dropTable('balancer_pools');
  }
};
