/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-ethers');

const fs = require('fs');
const file = process.env.Config || '.development.json';
const config = JSON.parse(fs.readFileSync(file, 'utf-8'));

module.exports = {
  solidity: {
    version: '0.8.7',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    opera: {
      url: "https://rpc.ftm.tools/",
      accounts: [ config['deployer'].privateKey ],
    },
    testnet: {
      url: "https://rpc.testnet.fantom.network/",
      accounts: [ config['deployer'].privateKey ],
    },
  }
};
