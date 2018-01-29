const CaiShen = artifacts.require("./CaiShen.sol");
const increaseTime = require("./increaseTime.js");

contract('CaiShen', accounts => {
  let cs;
  const creator = accounts[0];
  const recipient = accounts[1];
  const amount = web3.toWei(5, "ether");
  const fee = web3.toWei(0.005, "ether");


  it("should successfully redeem gift", async () => {
    cs = await CaiShen.new();

    const initialContractBalance = web3.eth.getBalance(cs.address).toNumber();
    const initialCreatorBalance = web3.eth.getBalance(creator).toNumber();
    const initialRecipientBalance = web3.eth.getBalance(recipient).toNumber();

    assert.equal(initialContractBalance, 0, "Initial contract balance should be 0");

    const expiry = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 10;

    // Call give()
    await cs.give(recipient, expiry, {to: cs.address, from: creator, value: amount});

    const feesCollected = await cs.feesCollected();
    assert.equal(feesCollected.toNumber(), fee, "Total fees collected should be correct");

    const postGiveContractBalance = web3.eth.getBalance(cs.address).toNumber();
    const postGiveCreatorBalance = web3.eth.getBalance(creator).toNumber();
    const postGiveRecipientBalance = web3.eth.getBalance(recipient).toNumber();

    assert.equal(postGiveContractBalance, amount, "Post-give contract balance should be 5 ether");
    assert.isAbove(initialCreatorBalance, postGiveCreatorBalance, "Post-give creator balance should have been reduced");
    assert.equal(initialRecipientBalance, postGiveRecipientBalance, "Post-give recipient balance should be untouched");

    const beforeTimeTravelTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp;

    await(increaseTime(20000));

    const afterTimeTravelTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp;

    assert.isAbove(afterTimeTravelTime, beforeTimeTravelTime, "Time travel must be successful");

    // Call redeem()
    await cs.redeem(0, {from: recipient});

    const postRedeemContractBalance = web3.eth.getBalance(cs.address).toNumber();
    const postRedeemCreatorBalance = web3.eth.getBalance(creator).toNumber();
    const postRedeemRecipientBalance = web3.eth.getBalance(recipient).toNumber();

    assert.equal(postRedeemContractBalance, fee, "Post-redeem contract balance should just be the fee");
    assert.equal(postRedeemCreatorBalance, postRedeemCreatorBalance, "Post-redeem creator balance should be untouched");
    assert.isAbove(postRedeemRecipientBalance, initialRecipientBalance, "Post-redeem recipient balance should have been increased");

    //const gift = await cs.giftIdToGift(0);
  });
});
