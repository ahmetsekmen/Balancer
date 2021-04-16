const { SOR } = require('@balancer-labs/sor');
const { BigNumber } = require('bignumber.js');
const { JsonRpcProvider } = require('@ethersproject/providers');

const config = {
  app: { // App Config
    secret: process.env.APP_SECRET,
    port: process.env.APP_PORT
  },
  web3: {
    provider: process.env.WEB3_PROVIDER,
    WETH: process.env.WETH_ADDRESS
  },
  balancer: {
    poolsUrl: process.env.BALANCER_POOLS_URL,
    subgraphUrl: process.env.BALANCER_SUBGRAPH_URL,
    gasPrice: process.env.BALANCER_GAS_PRICE,
    maxNoPools: 4,
    chainId: parseInt(process.env.NETWORK_ID, 10) || 1
  },
  db: {
    host: process.env.MYSQL_DB_HOST,
    database: process.env.MYSQL_DB_NAME,
    username: process.env.MYSQL_DB_USERNAME,
    password: process.env.MYSQL_DB_PASSWORD,
    dialect: 'mysql',
    pool: {
      max: 40,
      min: 10,
      acquire: 30000,
      idle: 10000
    },
    logging: false,
  },
};

// Create New Balancer SOR
const provider = new JsonRpcProvider(config.web3.provider);
const sor = new SOR(
  provider,
  new BigNumber(config.balancer.gasPrice),
  config.balancer.maxNoPools,
  config.balancer.chainId,
  config.balancer.poolsUrl
);

module.exports = {
  config,
  sor
};
