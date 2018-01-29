const CaiShen = artifacts.require("./CaiShen.sol");
const increaseTime = require("./increaseTime.js");

const expectThrow = async promise => {
  try {
    await promise;
    return false;
  } 
  catch (error) {
    const invalidOpcode = error.message.search('invalid opcode') >= 0;
    const outOfGas = error.message.search('out of gas') >= 0;
    const revert = error.message.search('revert') >= 0;

    assert(invalidOpcode || outOfGas || revert,
           'Expected throw, got \'' + error + '\' instead');
    return true;
  }
  assert.fail('Expected throw not received');
};

contract('CaiShen', accounts => {
  let cs;
  const creator = accounts[0];
  const recipient = accounts[1];
  const amount = web3.toWei(5, "ether");


  it("should fail when trying to redeem gift before expiry time", async () => {
    cs = await CaiShen.new();

    const expiry = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 1000;

    await cs.give(recipient, expiry, {to: cs.address, from: creator, value: amount});
    let result = await expectThrow(cs.redeem(0, {from: recipient}));

    assert.equal(result, true, "redeem() should throw an error because of the expiry timestamp");
  });
});
