module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('balancer_tokenPrices', {
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
    return queryInterface.dropTable('balancer_tokenPrices');
  }
};
