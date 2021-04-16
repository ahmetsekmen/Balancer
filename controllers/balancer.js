const { BigNumber } = require('bignumber.js');
const httpStatus = require('http-status');
const { Op } = require('sequelize');
const { spawn, Pool, Worker } = require('threads');
const models = require('../models');
const {
  sor,
} = require('../config');

const threadPool = Pool(() => spawn(new Worker('../modules/threads.js')), 12 /* optional size */);

exports.getBalancerTokenInfos = async (req, res) => {
  try {
    // const isFetched = await sor.fetchPools();
    // console.log('Fetch Result: ', isFetched);

    const balancerTokenList = await models.balancer_tokenPrice.findAll({
      attributes: ['address', 'decimals', 'symbol', 'ethToTokenPrice', 'tokenToEthPrice']
    });

    return res.status(httpStatus.OK).json(balancerTokenList);
  } catch (err) {
    console.log(err.message);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.getBalancerTokenInfo = async (req, res) => {
  try {
    const isFetched = await sor.fetchPools();
    console.log('Fetch Result: ', isFetched);

    // Get Balancer Tokens which exist swap with WETH
    const balancerTokens = await models.balancer_token.findAll({
      where: {
        // symbol: 'KNC'
        [Op.not]: {
          symbol: 'WETH'
        }
      },
      attributes: ['address', 'decimals', 'symbol'],
      group: ['address', 'decimals', 'symbol'],
      order: [
        ['symbol', 'ASC']
      ]
    });

    const sorWorkers = [];
    for (let i = 0; i < balancerTokens.length; i += 1) {
      sorWorkers.push(threadPool.queue((worker) => worker(balancerTokens[i].get())));
    }

    let balancerTokenList = await Promise.all(sorWorkers);

    balancerTokenList = balancerTokenList.filter((tokenData) => {
      if (tokenData.ethToTokenPrice === '0' || tokenData.tokenToEthPrice === '0') {
        return false;
      }
      return true;
    });

    return res.status(httpStatus.OK).json(balancerTokenList);
  } catch (err) {
    console.log(err.message);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: err.message
    });
  }
};
