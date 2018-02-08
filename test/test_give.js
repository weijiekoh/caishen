const CaiShen = artifacts.require("./CaiShen.sol");
const expectThrow = require("./expectThrow.js");
const increaseTime = require("./increaseTime.js");

contract('CaiShen', accounts => {
  let cs;
  const creator = accounts[0];
  const recipient = accounts[1];
  const amount = web3.toWei(1, "ether");
  const fee = web3.toWei(0.01, "ether");

  it("give() should fail because the expiry is in the past", async () => {
    let cs = await CaiShen.new();
    const expiry = web3.eth.getBlock(web3.eth.blockNumber).timestamp - 10000;
    const result = await expectThrow(cs.give(recipient, expiry, "name", "message", {from: creator, value: amount}));
    assert.isTrue(result, "give() should fail");
  });

  it("give() should fail because the amount is 0", async () => {
    let cs = await CaiShen.new();
    const expiry = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 1000;
    const result = await expectThrow(cs.give(creator, expiry, "name", "message", {from: creator, value: 0}));
    assert.isTrue(result, "give() should fail");
  });

  it("give() should fail because the recipient is the same as the giver", async () => {
    let cs = await CaiShen.new();
    const expiry = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 1000;
    const result = await expectThrow(cs.give(creator, expiry, "name", "message", {from: creator, value: amount}));
    assert.isTrue(result, "give() should fail");
  });

  it("Gift attributes from giftIdToGift()", async () => {
    let cs = await CaiShen.new();
    const expiry = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 1000;
    await cs.give(recipient, expiry, "name", "message", {from: creator, value: amount});
    let giftId = 0;
    const gift = await cs.giftIdToGift(giftId);
    const existsRes = gift[0];
    const giftIdRes = gift[1];
    const giverRes = gift[2];
    const recipientRes = gift[3];
    const expiryRes = gift[4];
    const amountRes = gift[5];
    const redeemedRes = gift[6];
    const nameRes = gift[7]
    const messageRes = gift[8]
    const timestampRes = gift[9];

    const feesGathered = await cs.feesGathered();
    assert.equal(feesGathered.toNumber(), fee, "Total fees collected should be correct");

    assert.equal(existsRes.valueOf(), true, "Gift should be marked as existing");
    assert.equal(giftIdRes.valueOf(), giftId, "Gift ID should be 0");
    assert.equal(giverRes.valueOf(), creator, "Giver's address should match");
    assert.equal(recipientRes.valueOf(), recipient, "Recipient's address should match");
    assert.equal(expiryRes.valueOf(), expiry, "Expiry timestamp should match");
    assert.equal(amountRes.valueOf(), amount - fee, "Amount - fee should match");
    assert.equal(redeemedRes.valueOf(), false, "Gift should be marked as unredeemed");
    assert.equal(nameRes.valueOf(), "name", "Gift should be have the correct name");
    assert.equal(messageRes.valueOf(), "message", "Gift should be have the correct message");
    assert.isTrue(timestampRes.valueOf() < Date.now(), "Gift timestamp should be in the past");
  });

});
