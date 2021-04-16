const BigNumber = require('bignumber.js');
const { web3 } = require('./web3');

const bnToDec = (bn, decimals = 18) => {
  return bn.dividedBy(new BigNumber(10).pow(decimals)).toNumber();
};

const bnDivdedByDecimals = (bn, decimals = 18) => {
  return bn.dividedBy(new BigNumber(10).pow(decimals));
};

const bnMultipledByDecimals = (bn, decimals = 18) => {
  return bn.multipliedBy(new BigNumber(10).pow(decimals));
};

const decToBn = (dec, decimals = 18) => {
  return new BigNumber(dec).multipliedBy(new BigNumber(10).pow(decimals));
};

const createEthAccount = () => {
  return web3.eth.accounts.create();
};

const getETHBalance = async (address) => {
  const ethBalance = await web3.eth.getBalance(address);
  return bnDivdedByDecimals(new BigNumber(ethBalance));
};

const checkETHBalance = async (address, threshold = 0) => {
  const balance = await getETHBalance(address);
  if (balance.lte(new BigNumber(threshold))) {
    throw new Error('Insufficient balance');
  }
  return balance;
};

const callMethod = async (method, args = []) => {
  const result = await method(...args).call();
  return result;
};

module.exports = {
  createEthAccount,
  getETHBalance,
  checkETHBalance,
  callMethod,
  bnToDec,
  bnDivdedByDecimals,
  bnMultipledByDecimals,
  decToBn,
};
