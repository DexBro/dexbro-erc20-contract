const { expect } = require('chai');
const {
  config,
  ethers,
} = require('../lib');


const ERRORS = {
  PAUSED: 'ERC20Pausable: token transfer while paused',

  NOT_PAUSER_PAUSE: 'pauser role to pause',
  NOT_PAUSER_UNPAUSE: 'pauser role to unpause',
};

describe('ERC20MinterPauser', () => {
  const name = config['erc20'].name;
  const symbol = config['erc20'].symbol;
  const decimals = config['erc20'].decimals;
  const Unit = ethers.BigNumber.from(10).pow(decimals);
  const totalSupply = Unit.mul(config['erc20'].totalSupply);

  let deployer, alice, bob;  // accounts
  let erc20;  // contracts

  beforeEach(async () => {
    // preset accounts
    [ deployer, alice, bob ] = await ethers.getSigners();

    // retrieve Contract Factory
    const ERC20Pauser = await ethers.getContractFactory('ERC20Pauser');

    // deploy
    erc20 = await ERC20Pauser.deploy(
      name,
      symbol,
      totalSupply,
      alice.address,
    );
  });

  describe('unit test', () => {
    it('0. constructor', async () => {
      expect(await erc20.name()).to.equal(name);
      expect(await erc20.symbol()).to.equal(symbol);
      expect(await erc20.decimals()).to.equal(decimals);
      expect(await erc20.totalSupply()).to.equal(totalSupply);
      expect(await erc20.balanceOf(alice.address)).to.equal(totalSupply);
    });

    it('1. NOT_PAUSER_PAUSE when erc20.pause', async () => {
      await expect(erc20.connect(alice).pause()).to.revertedWith(ERRORS.NOT_PAUSER_PAUSE);
    });

    it('1. erc20.pause', async () => {
      await erc20.pause();
      await expect(
        erc20.connect(alice).transfer(deployer.address, Math.floor(Math.random() * 1000000))
      ).to.revertedWith(ERRORS.PAUSED);
    });

    it('2. NOT_PAUSER_UNPAUSE when erc20.unpause', async () => {
      await expect(erc20.connect(alice).unpause()).to.revertedWith(ERRORS.NOT_PAUSER_UNPAUSE);
    });

    it('2. erc20.unpause', async () => {
      const amount = Math.floor(Math.random() * 1000000);
      await erc20.connect(alice).transfer(bob.address, amount);
      expect(await erc20.totalSupply()).to.equal(totalSupply);
      expect(await erc20.balanceOf(alice.address)).to.equal(totalSupply.sub(amount));
      expect(await erc20.balanceOf(bob.address)).to.equal(amount);
    });
  });
});
