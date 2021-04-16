const { BigNumber } = require('bignumber.js');
const { expose } = require('threads/worker');
const {
  sor,
  config
} = require('../config');

expose((tokenData) => {
  try {
    let amountOut = 0;
    try {
      // Set Balancer Output Token
      sor.setCostOutputToken(tokenData.address);
      // Get amountOut with Pool
      [, amountOut] = sor.getSwaps(
        config.web3.WETH,
        tokenData.address,
        'swapExactIn',
        new BigNumber(1e18)
      );
    } catch (err) {
      console.log('Get Balancer Swap Exact In: ', err.message);
    }
    tokenData.ethToTokenPrice = (new BigNumber(amountOut)).dividedBy(tokenData.decimals).toString();

    let amountIn = 0;
    try {
      // Set Balancer Output Token
      sor.setCostOutputToken(config.web3.WETH);
      // Get amountOut with Pool
      [, amountIn] = sor.getSwaps(
        tokenData.address,
        config.web3.WETH,
        'swapExactOut',
        new BigNumber(1e18)
      );
    } catch (err) {
      console.log('Get Balancer Swap Exact Out: ', err.message);
    }
    tokenData.tokenToEthPrice = (new BigNumber(amountIn)).dividedBy(tokenData.decimals).toString();
  } catch (err) {
    console.log('Expose Threads: ', tokenData.address, err.message);
  }
  return tokenData;
});
