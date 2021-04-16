module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('balancer_tokens', {
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
    return queryInterface.dropTable('balancer_tokens');
  }
};
