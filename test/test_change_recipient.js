const CaiShen = artifacts.require("./CaiShen.sol");
const expectThrow = require("./expectThrow.js");

contract('CaiShen', accounts => {
  const creator = accounts[0];
  const giver = accounts[1];
  const recipient = accounts[2];
  const newRecipient = accounts[3];
  const amount = web3.toWei(5, "ether");

  it("should fail to change recipient", async () => {
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

    // Call changeRecipient()
    await cs.changeRecipient(newRecipient, 0, {from: recipient});

    const giftNew = await cs.giftIdToGift(0);

    assert.equal(giftNew[3], newRecipient, "newRecipient should be the current recipient");
  });
});
