const CaiShen = artifacts.require("./CaiShen.sol");
const expectThrow = require("./expectThrow.js");

contract('CaiShen', accounts => {
  let cs;
  const creator = accounts[0];
  const recipient = accounts[1];
  const amount = web3.toWei(1, "ether");
  const fee = web3.toWei(0.01, "ether");

  it("give() should fail because the expiry is in the past", async () => {
    let cs = await CaiShen.new();
    const expiry = web3.eth.getBlock(web3.eth.blockNumber).timestamp - 10000;
    const result = await expectThrow(cs.give(recipient, expiry, {from: creator, value: amount}));
    assert.isTrue(result, "give() should fail");
  });

  it("give() should fail because the amount is 0", async () => {
    let cs = await CaiShen.new();
    const expiry = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 1000;
    const result = await expectThrow(cs.give(creator, expiry, {from: creator, value: 0}));
    assert.isTrue(result, "give() should fail");
  });

  it("give() should fail because the recipient is the same as the giver", async () => {
    let cs = await CaiShen.new();
    const expiry = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 1000;
    const result = await expectThrow(cs.give(creator, expiry, {from: creator, value: amount}));
    assert.isTrue(result, "give() should fail");
  });

  it("Gift attributes from giftIdToGift()", async () => {
    let cs = await CaiShen.new();
    const expiry = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 1000;
    await cs.give(recipient, expiry, {from: creator, value: amount});
    let giftId = 0;
    const gift = await cs.giftIdToGift(giftId);
    const existsRes = gift[0];
    const giftIdRes = gift[1];
    const giverRes = gift[2];
    const recipientRes = gift[3];
    const expiryRes = gift[4];
    const amountRes = gift[5];
    const redeemedRes = gift[6];
    const refundedRes = gift[7];

    const feesCollected = await cs.feesCollected();
    assert.equal(feesCollected.toNumber(), fee, "Total fees collected should be correct");

    assert.equal(existsRes.valueOf(), true, "Gift should be marked as existing");
    assert.equal(giftIdRes.valueOf(), giftId, "Gift ID should be 0");
    assert.equal(giverRes.valueOf(), creator, "Giver's address should match");
    assert.equal(recipientRes.valueOf(), recipient, "Recipient's address should match");
    assert.equal(expiryRes.valueOf(), expiry, "Expiry timestamp should match");
    assert.equal(amountRes.valueOf(), amount - fee, "Amount - fee should match");
    assert.equal(redeemedRes.valueOf(), false, "Gift should be marked as unredeemed");
    assert.equal(refundedRes.valueOf(), false, "Gift should be marked as unrefunded");
  });


  it("Gift attributes from getGiftIdsByRecipient()", async () => {
    let cs = await CaiShen.new();
    const expiry = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 1000;
    await cs.give(recipient, expiry, {from: creator, value: amount});
    const giftIds = await cs.getGiftIdsByRecipient(recipient);
    const existsRes = await cs.doesGiftExist(giftIds[0].valueOf());
    const giverRes = await cs.getGiftGiver(giftIds[0].valueOf());
    const recipientRes = await cs.getGiftRecipient(giftIds[0].valueOf());
    const expiryRes = await cs.getGiftExpiry(giftIds[0].valueOf());
    const amountRes = await cs.getGiftAmount(giftIds[0].valueOf());
    const redeemedRes = await cs.isGiftRedeemed(giftIds[0].valueOf());
    const refundedRes = await cs.isGiftRefunded(giftIds[0].valueOf());

    const feesCollected = await cs.feesCollected();
    assert.equal(feesCollected.toNumber(), fee, "Total fees collected should be correct");

    assert.equal(giftIds.length, 1, "Only 1 gift ID should be in the array");
    assert.equal(amountRes.valueOf(), amount - fee, "Amount - fee should match");
    assert.equal(expiryRes.valueOf(), expiry, "Expiry timestamp should match");
    assert.equal(giverRes.valueOf(), creator, "Giver's address should match");
    assert.equal(recipientRes.valueOf(), recipient, "Recipient's address should match");
    assert.equal(existsRes.valueOf(), true, "Gift should be marked as existing");
    assert.equal(redeemedRes.valueOf(), false, "Gift should be marked as unredeemed");
    assert.equal(refundedRes.valueOf(), false, "Gift should be marked as unrefunded");
  });
});
