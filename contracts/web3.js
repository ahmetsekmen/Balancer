const Web3 = require('web3');
const { config } = require('../config');

const web3 = new Web3(config.web3.provider);

module.exports = {
  Web3,
  web3
};
