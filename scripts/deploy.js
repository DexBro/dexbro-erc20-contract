const {
  config,
  ethers,
} = require('../lib');

async function main() {
  const name = config['erc20'].name;
  const symbol = config['erc20'].symbol;
  const decimals = config['erc20'].decimals;
  const Unit = ethers.BigNumber.from(10).pow(decimals);
  const totalSupply = Unit.mul(config['erc20'].totalSupply);
  const multisig = config['erc20'].multisig;

  // retrieve Contract Factory
  const ERC20Pauser = await ethers.getContractFactory('ERC20Pauser');

  // deploy
  const erc20 = await ERC20Pauser.deploy(
    name,
    symbol,
    totalSupply,
    multisig,
  );

  await erc20.deployed();
  console.log('erc20: ', erc20.address);

  console.log('name(): ', await erc20.name());
  console.log('symbol(): ', await erc20.symbol());
  console.log('decimals(): ', await erc20.decimals());
  console.log('totalSupply(): ', (await erc20.totalSupply()).toString());
  console.log('balanceOf(multisig): ', (await erc20.balanceOf(multisig)).toString());
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
