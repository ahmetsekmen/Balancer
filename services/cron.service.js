const updateFetchPoolCron = require('./updateFetchPoolCron');
const updateBalancerPoolCron = require('./updateBalancerPoolCron');

module.exports = function () {
  // Run updateFetchPool Cron
  updateFetchPoolCron();
  // Run updateBalancerPool Cron
  updateBalancerPoolCron();
};
