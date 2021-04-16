const fetch = require('node-fetch');
const { config } = require('../config');

async function callGraphQL(url, query) {
  let result = {};
  try {
    // Get GraphQL Resp
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query })
    });

    result = await resp.json();
  } catch (err) {
    console.log('Call GraphQL: ', err);
  }
  return result;
}

async function getBalancerPoolList() {
  let poolInfoList = [];
  try {
    let skipId = 0;
    let respLength = 0;
    do {
      // Get Balancer Pool List Query
      const query = `{
        pools(first: 1000, skip: ${skipId}, where: {tokensList_contains: ["${config.web3.WETH}"], publicSwap: true}) {
          id
          finalized
          publicSwap
          swapFee
          tokensList
          tokens {
            id
            address
            balance
            decimals
            denormWeight
            symbol
          }
          totalWeight
        }
      }`;

      // Call GraphQL API
      // eslint-disable-next-line no-await-in-loop
      const resp = await callGraphQL(config.balancer.subgraphUrl, query);

      // Get Length
      respLength = resp.data.pools.length;
      // Update Pool Info List
      poolInfoList = poolInfoList.concat(resp.data.pools);
      // Update SkipID
      skipId += 1000;
    } while (respLength >= 1000);
  } catch (err) {
    console.log('Get Balancer Pool List: ', err.message);
  }

  console.log(`Balancer Pool Count: ${poolInfoList.length}`);
  return poolInfoList;
}

module.exports = {
  getBalancerPoolList
};
