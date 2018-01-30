const CaiShen = artifacts.require("./CaiShen.sol");
const expectThrow = require("./expectThrow.js");
const increaseTime = require("./increaseTime.js");

contract('CaiShen', accounts => {
  const creator = accounts[0];
  const giver = accounts[1];
  const recipient = accounts[2];
  const amount = web3.toWei(2, "ether");
  const gasPrice = web3.toBigNumber(10000000000);

  it("should now allow the recipient to return funds of a redeemed gift", async () => {
    let cs = await CaiShen.new();
    const expiry = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 300;
    await cs.give(recipient, expiry, {to: cs.address, from: giver, value: amount, gasPrice: gasPrice});
    await increaseTime(1000);
    await cs.redeem(0, {from: recipient});
    const result = await expectThrow(cs.returnToGiver(0, {from: recipient}));
    assert.isTrue(result, "returnToGiver() should throw");
  });

  it("should now allow the recipient to return funds of an already returned gift", async () => {
    let cs = await CaiShen.new();
    const expiry = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 300;
    await cs.give(recipient, expiry, {to: cs.address, from: giver, value: amount, gasPrice: gasPrice});
    await cs.returnToGiver(0, {from: recipient});
    const result = await expectThrow(cs.returnToGiver(0, {from: recipient}));
    assert.isTrue(result, "returnToGiver() should throw");
  });

  it("should now allow the recipient to return funds of an already refunded gift", async () => {
    let cs = await CaiShen.new();
    const expiry = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 300;
    await cs.give(recipient, expiry, {to: cs.address, from: giver, value: amount, gasPrice: gasPrice});
    await cs.allowRefunds({from: creator});
    await cs.claimRefund(0, {from: giver});
    const result = await expectThrow(cs.returnToGiver(0, {from: recipient}));
    assert.isTrue(result, "returnToGiver() should throw");
  });

  it("should allow the recipient to return funds to the giver", async () => {
    let cs = await CaiShen.new();
    const expiry = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 300;
    await cs.give(recipient, expiry, {to: cs.address, from: giver, value: amount, gasPrice: gasPrice});

    const preGiveBalance = web3.eth.getBalance(giver);
    await cs.returnToGiver(0, {from: recipient});
    const postGiveBalance = web3.eth.getBalance(giver);

    const fee = await cs.fee(amount);

    assert.isTrue(postGiveBalance.minus(preGiveBalance).plus(fee).minus(amount).equals(0), "giver shoudl get the amount-fee back");
  });
});
