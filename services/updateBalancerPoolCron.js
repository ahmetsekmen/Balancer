const cron = require('node-cron');
const moment = require('moment');
const { getBalancerPoolList } = require('../modules/balancerAPIModule');
const models = require('../models');

async function updateBalancerPoolCron() {
  try {
    // Get Current Time with UTC
    const currentTime = moment().utc().subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss')
      .toString();
    console.log(`===== ${currentTime}: Update Balancer Pool =====`);

    // Get Balancer Pool List
    const balancerPoolList = await getBalancerPoolList();

    // For Each Pool
    await Promise.all(balancerPoolList.map(async (poolElement) => {
      // Check Existed Pool
      const existedPool = await models.balancer_pool.findOne({
        where: {
          poolId: poolElement.id
        }
      });

      // If Not Exist
      if (!existedPool) {
        // Create New Pool
        const newPool = await models.balancer_pool.create({
          poolId: poolElement.id,
          finalized: poolElement.finalized,
          publicSwap: poolElement.publicSwap,
          swapFee: poolElement.swapFee,
          totalWeight: poolElement.totalWeight
        });

        // For Each Pool Tokens
        await Promise.all(poolElement.tokens.map(async (poolTokenElement) => {
          // Check Existed Token
          const existedToken = await models.balancer_token.findOne({
            where: {
              tokenId: poolTokenElement.id
            }
          });

          // If Not Exist
          if (!existedToken) {
            // Create New Token
            const newToken = await models.balancer_token.create({
              tokenId: poolTokenElement.id,
              address: poolTokenElement.address,
              balance: poolTokenElement.balance,
              decimals: poolTokenElement.decimals,
              denormWeight: poolTokenElement.denormWeight,
              symbol: poolTokenElement.symbol
            });

            // Create New PoolToken
            await models.balancer_poolToken.create({
              poolId: newPool.id,
              tokenId: newToken.id
            });
          }
        }));
      }
    }));
    console.log('===== Update Balancer Pool Finished =====');
  } catch (err) {
    console.log('Update Fetch Pool Cron: ', err.message);
  }
}

module.exports = function () {
  // cron.schedule('0 34 22 * * *', () => {
  cron.schedule('0 0 * * * *', () => {
    updateBalancerPoolCron();
  }, {
    scheduled: true,
    timezone: 'Europe/London'
  });
};
