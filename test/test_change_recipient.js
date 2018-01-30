const CaiShen = artifacts.require("./CaiShen.sol");
const expectThrow = require("./expectThrow.js");
const increaseTime = require("./increaseTime.js");

contract('CaiShen', accounts => {
  const creator = accounts[0];
  const giver = accounts[1];
  const recipient = accounts[2];
  const newRecipient = accounts[3];
  const amount = web3.toWei(2, "ether");

  it("should fail to change recipient if the gift has already been redeemed", async () => {
    let cs = await CaiShen.new();
    const expiry = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 1000;
    await cs.give(recipient, expiry, {to: cs.address, from: creator, value: amount});
    await increaseTime(2000);
    await cs.redeem(0, {from: recipient});
    const result = await expectThrow(cs.changeRecipient(newRecipient, 0, {from: recipient}));
    assert.equal(result, true, "recipient cannot be changed after redemption");
  });

  it("should fail to change recipient if the giver tries to do so", async () => {
    let cs = await CaiShen.new();
    const expiry = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 1000;

    // Give a gift
    await cs.give(recipient, expiry, {to: cs.address, from: creator, value: amount});

    let result = await expectThrow(cs.changeRecipient(newRecipient, 0, {from: giver}));

    assert.equal(result, true, "recipient cannot be changed by the giver");
  });

  it("should change recipient", async () => {
    let cs = await CaiShen.new();
    const expiry = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 1000;

    // Give a gift
    await cs.give(recipient, expiry, {to: cs.address, from: creator, value: amount});

    let gift = await cs.giftIdToGift(0);

    assert.equal(gift[3], recipient, "recipient should be the current recipient");

    let giftIds = await cs.getGiftIdsByRecipient(recipient);
    assert.isTrue(giftIds[0].equals(0), "recipientToGiftIds should be udpated");

    // Call changeRecipient()
    await cs.changeRecipient(newRecipient, 0, {from: recipient});

    const giftNew = await cs.giftIdToGift(0);

    assert.equal(giftNew[3], newRecipient, "newRecipient should be the current recipient");

    giftIds = await cs.getGiftIdsByRecipient(newRecipient);
    assert.isTrue(giftIds[0].equals(0), "recipientToGiftIds should be udpated");
  });
});
