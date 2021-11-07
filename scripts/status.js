const {
  config,
  ethers,
} = require('../lib');

async function main() {
  const address = config['erc20'].address;

  // retrieve Contract Factory
  const ERC20Pauser = await ethers.getContractFactory('ERC20Pauser');

  // deploy
  const erc20 = await ERC20Pauser.attach(address);

  console.log('name(): ', await erc20.name());
  console.log('symbol(): ', await erc20.symbol());
  console.log('decimals(): ', await erc20.decimals());
  console.log('totalSupply(): ', (await erc20.totalSupply()).toString());
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
