const CaiShen = artifacts.require("./CaiShen.sol");

contract('CaiShen', accounts => {
  let cs;
  const creator = 0;
  const recipient = 0;
  const expiry = 0;
  const amount = 0;
  const nullAddress = "0x0000000000000000000000000000000000000000";

  beforeEach(async () => {
    cs = await CaiShen.new();
  });

  it("Null gift attributes from giftIdToGift()", async () => {
    let giftId = 0;
    let nullGift = await cs.giftIdToGift(giftId);
    const existsRes = nullGift[0];
    const giftIdRes = nullGift[1];
    const giverRes = nullGift[2];
    const recipientRes = nullGift[3];
    const expiryRes = nullGift[4];
    const amountRes = nullGift[5];
    const redeemedRes = nullGift[6];
    const nameRes = nullGift[7];
    const messageRes = nullGift[8];

    assert.equal(giftIdRes.valueOf(), giftId, "Gift ID should be 0");
    assert.equal(amountRes.valueOf(), amount, "Amount should match");
    assert.equal(expiryRes.valueOf(), expiry, "Expiry timestamp should match");
    assert.equal(giverRes.valueOf(), nullAddress, "Giver's address should match");
    assert.equal(recipientRes.valueOf(), nullAddress, "Recipient's address should match");
    assert.equal(existsRes.valueOf(), false, "Gift should be marked as existing");
    assert.equal(redeemedRes.valueOf(), false, "Gift should be marked as unredeemed");
    assert.equal(nameRes.valueOf(), "", "Name should be blank");
    assert.equal(messageRes.valueOf(), "", "Message should be blank");
  });


  it("Null gift attributes from getGiftIdsByRecipient()", async () => {
    const giftIds = await cs.getGiftIdsByRecipient(accounts[0]);

    assert.equal(giftIds.length, 0, "No gift IDs should be in the array");
  });
});
