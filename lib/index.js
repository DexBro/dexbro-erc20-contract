// config
const fs = require('fs');
const file = process.env.Config || '.development.json';
const config = JSON.parse(fs.readFileSync(file, 'utf-8'));

// ethers
const hre = require('hardhat');
const ethers = hre.ethers;
const utils = hre.ethers.utils;
const Wallet = hre.ethers.Wallet;

const chainId = async () => {
  return (await ethers.provider.detectNetwork()).chainId;
}

const chainName = async () => {
  const chainId = (await ethers.provider.detectNetwork()).chainId;
  switch (chainId) {
    case 1:
      return 'ethereum';
    case 3:
      return 'ropsten';
    case 4:
      return 'rinkeby';
    case 5:
      return 'goerli';
    case 42:
      return 'kovan';
    case 100:
      return 'xdai';
    case 137:
      return 'matic';
    case 250:
      return 'opera';
    case 4002:
      return 'fantom testnet';
    case 80001:
      return 'mumbai';
    default:
      return 'unknown';
  }
}

// EIP712
const eip712Domain = (name, version, chainId, verifyingContract) => {
  return {
    name,
    version,
    chainId,
    verifyingContract,
  };
};

const eip712SignTypedDate = async (signer, domain, types, value) => {
  return await signer._signTypedData(domain, types, value);
}

module.exports = {
  config,
  ethers,
  utils,
  Wallet,

  chainId,
  chainName,
  eip712Domain,
  eip712SignTypedDate,
};
