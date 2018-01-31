const CaiShen = artifacts.require("./CaiShen.sol");
const expectThrow = require("./expectThrow.js");

contract('CaiShen', accounts => {
  const creator = accounts[0];
  const giver = accounts[1];
  const recipient = accounts[2];
  const newRecipient = accounts[3];
  const amount = web3.toWei(1, "ether");

  it("should not update recipientToGiftIds due to empty array", async () => {
    let cs = await CaiShen.new();
    const expiry = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 1000;
    let result = await expectThrow(cs.changeRecipient(newRecipient, 1, {from: newRecipient}));
    assert.isTrue(result, "changeRecipient should throw");
  });

  it("should not update recipientToGiftIds due to invalid caller", async () => {
    let cs = await CaiShen.new();
    const expiry = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 1000;

    // Give gift
    await cs.give(recipient, expiry, {to: cs.address, from: creator, value: amount});

    let result = await expectThrow(cs.changeRecipient(newRecipient, 1, {from: newRecipient}));

    assert.isTrue(result, "changeRecipient should throw");
  });

  it("should update recipientToGiftIds (1 gift in array)", async () => {
    let cs = await CaiShen.new();
    const expiry = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 1000;

    // Give gift
    await cs.give(recipient, expiry, {to: cs.address, from: creator, value: amount});
    let giftIds = await cs.getGiftIdsByRecipient(recipient);
    assert.isTrue(giftIds[0].equals(0), "recipientToGiftIds[recipient][0] should be correct");
    assert.equal(giftIds.length, 1, "recipientToGiftIds[recipient] length should be 1");

    await cs.changeRecipient(newRecipient, 0, {from: recipient});

    giftIds = await cs.getGiftIdsByRecipient(newRecipient);
    assert.isTrue(giftIds[0].equals(0), "recipientToGiftIds[newRecipient][0] should be correct");
    assert.equal(giftIds.length, 1, "recipientToGiftIds[newRecipient] length should be 1");

    giftIds = await cs.getGiftIdsByRecipient(recipient);
    assert.equal(giftIds.length, 0, "recipientToGiftIds[rocipient] length should now be 0");
  });

  it("should update recipientToGiftIds (3 gifts in array)", async () => {
    let cs = await CaiShen.new();
    const expiry = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 1000;

    // Give 3 gifts
    await cs.give(recipient, expiry, {to: cs.address, from: creator, value: amount});
    await cs.give(recipient, expiry, {to: cs.address, from: creator, value: amount});
    await cs.give(recipient, expiry, {to: cs.address, from: creator, value: amount});

    let giftIds = await cs.getGiftIdsByRecipient(recipient);
    assert.isTrue(giftIds[0].equals(0), "recipientToGiftIds[recipient][0] should be correct");
    assert.isTrue(giftIds[1].equals(1), "recipientToGiftIds[recipient][1] should be correct");
    assert.isTrue(giftIds[2].equals(2), "recipientToGiftIds[recipient][2] should be correct");

    // Call changeRecipient()
    await cs.changeRecipient(newRecipient, 1, {from: recipient});

    const giftNew = await cs.giftIdToGift(1);
    assert.equal(giftNew[3], newRecipient, "newRecipient should be the current recipient");

    giftIds = await cs.getGiftIdsByRecipient(newRecipient);
    assert.equal(giftIds.length, 1, "recipientToGiftIds[newRecipient] should have 1 element");
    assert.isTrue(giftIds[0].equals(1), "recipientToGiftIds[newRecipient][0] should be 1");

    giftIds = await cs.getGiftIdsByRecipient(recipient);
    assert.equal(giftIds.length, 2, "recipientToGiftIds[recipient] should have 2 elements");
    assert.isTrue(giftIds[0].equals(0), "recipientToGiftIds[recipient][0] should be 0");
    assert.isTrue(giftIds[1].equals(2), "recipientToGiftIds[recipient][0] should be 2");
  });

  it("should update recipientToGiftIds (3 gifts in array and the item is the last gift)", async () => {
    let cs = await CaiShen.new();
    const expiry = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 1000;

    // Give 3 gifts
    await cs.give(recipient, expiry, {to: cs.address, from: creator, value: amount});
    await cs.give(recipient, expiry, {to: cs.address, from: creator, value: amount});
    await cs.give(recipient, expiry, {to: cs.address, from: creator, value: amount});

    let giftIds = await cs.getGiftIdsByRecipient(recipient);
    assert.isTrue(giftIds[0].equals(0), "recipientToGiftIds[recipient][0] should be correct");
    assert.isTrue(giftIds[1].equals(1), "recipientToGiftIds[recipient][1] should be correct");
    assert.isTrue(giftIds[2].equals(2), "recipientToGiftIds[recipient][2] should be correct");

    // Call changeRecipient()
    await cs.changeRecipient(newRecipient, 2, {from: recipient});

    const giftNew = await cs.giftIdToGift(2);
    assert.equal(giftNew[3], newRecipient, "newRecipient should be the current recipient");

    giftIds = await cs.getGiftIdsByRecipient(newRecipient);
    assert.equal(giftIds.length, 1, "recipientToGiftIds[newRecipient] should have 1 element");
    assert.isTrue(giftIds[0].equals(2), "recipientToGiftIds[newRecipient][0] should be 1");

    giftIds = await cs.getGiftIdsByRecipient(recipient);
    assert.equal(giftIds.length, 2, "recipientToGiftIds[recipient] should have 2 elements");
    assert.isTrue(giftIds[0].equals(0), "recipientToGiftIds[recipient][0] should be 0");
    assert.isTrue(giftIds[1].equals(1), "recipientToGiftIds[recipient][0] should be 2");
  });
});
