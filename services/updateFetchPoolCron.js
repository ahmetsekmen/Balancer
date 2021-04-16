const { BigNumber } = require('bignumber.js');
const cron = require('node-cron');
const { Op } = require('sequelize');
const moment = require('moment');
const models = require('../models');
const {
  sor,
  config
} = require('../config');

async function getBalancerSwapExactIn(tokenIn, tokenOut, amountIn, decimals) {
  let amountOut = 0;
  try {
    const swapType = 'swapExactIn';
    // Set Balancer Output Token
    await sor.setCostOutputToken(tokenOut);
    // Get amountOut with Pool
    [, amountOut] = await sor.getSwaps(
      tokenIn,
      tokenOut,
      swapType,
      amountIn
    );
  } catch (err) {
    console.log('Get Balancer Swap Exact In: ', err.message);
  }
  return (new BigNumber(amountOut)).dividedBy(new BigNumber(10 ** decimals)).toString();
}

async function getBalancerSwapExactOut(tokenIn, tokenOut, amountOut, decimals) {
  let amountIn = 0;
  try {
    const swapType = 'swapExactOut';
    // Set Balancer Output Token
    await sor.setCostOutputToken(tokenOut);
    // Get amountOut with Pool
    [, amountIn] = await sor.getSwaps(
      tokenIn,
      tokenOut,
      swapType,
      amountOut
    );
  } catch (err) {
    console.log('Get Balancer Swap Exact Out: ', err.message);
  }
  return (new BigNumber(amountIn)).dividedBy(new BigNumber(10 ** decimals)).toString();
}

async function updateFetchPoolCron() {
  try {
    // Get Current Time with UTC
    const currentTime = moment().utc().subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss')
      .toString();
    console.log(`===== ${currentTime}: Update Fetch Pools From Balancer =====`);

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

    // Get Fetch Pools
    const isFetched = await sor.fetchPools();
    console.log('Fetch Result: ', isFetched);

    const amount = new BigNumber('1000000000000000000');
    await Promise.all(balancerTokens.map(async (balancerToken) => {
      const tokenData = balancerToken.get();
      // Get ethToToken Price
      const ethToTokenPrice = await getBalancerSwapExactIn(config.web3.WETH, tokenData.address, amount, tokenData.decimals);
      // Get ethToToken Price
      const tokenToEthPrice = await getBalancerSwapExactOut(tokenData.address, config.web3.WETH, amount, tokenData.decimals);

      // Upsert TokenPrice
      if (ethToTokenPrice !== '0' && tokenToEthPrice !== '0') {
        const existedTokenPrice = await models.balancer_tokenPrice.findOne({
          where: {
            address: tokenData.address
          }
        });

        if (existedTokenPrice) {
          if (existedTokenPrice.ethToTokenPrice !== ethToTokenPrice ||
              existedTokenPrice.tokenToEthPrice !== tokenToEthPrice) {
            await existedTokenPrice.update({
              ethToTokenPrice,
              tokenToEthPrice
            });
          }
        } else {
          await models.balancer_tokenPrice.create({
            address: tokenData.address,
            symbol: tokenData.symbol,
            decimals: tokenData.decimals,
            ethToTokenPrice,
            tokenToEthPrice
          });
        }
      }
    }));

  } catch (err) {
    console.log('Update Fetch Pool Cron: ', err);
  }
}

module.exports = function () {
  // cron.schedule('*/2 * * * *', () => {
  cron.schedule('0 0 20 * * *', () => {
    updateFetchPoolCron();
  }, {
    scheduled: true,
    timezone: 'Europe/London'
  });
};
