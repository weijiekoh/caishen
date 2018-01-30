const CaiShen = artifacts.require("./CaiShen.sol");
const expectThrow = require("./expectThrow.js");

contract('CaiShen', accounts => {
  const creator = accounts[0];
  const giver = accounts[1];
  const recipient = accounts[2];
  const amount = web3.toWei(5, "ether");
  const gasPrice = web3.toBigNumber(10000000000);

  it("should fail to return funds if the expiry has passed", async () => {
  });

  it("should fail to return funds if allowRefunds() is not invoked first", async () => {
    let cs = await CaiShen.new();
    const expiry = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 3000;
    let transaction = await cs.give(recipient, expiry, {to: cs.address, from: giver, value: amount, gasPrice: gasPrice});
    let result = await expectThrow(cs.claimRefund(0, {from: giver, gasPrice: gasPrice}));
    assert.isTrue(result, true, "claimRefund() should throw");
  });


  it("should return funds after allowRefunds()", async () => {
    let cs = await CaiShen.new();
    const expiry = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 3000;
    const fee = await cs.fee(amount);

    // Call give()
    const preGive = web3.eth.getBalance(giver);
    let transaction = await cs.give(recipient, expiry, {to: cs.address, from: giver, value: amount, gasPrice: gasPrice});
    const postGive = web3.eth.getBalance(giver);

    const gasUsed = web3.toBigNumber(transaction.receipt.gasUsed);
    const gasPaid = gasUsed.times(gasPrice);

    assert.isTrue(preGive.minus(postGive).minus(gasPaid).equals(web3.toBigNumber(amount)), "giver should have a lower balance after giving");

    // Call allowRefunds()
    await cs.allowRefunds({from: creator});

    // Find out how much will be refunded
    let gift = await cs.giftIdToGift(0);
    let amtGiven = gift[5];

    // Get pre-refund balance
    const preRefund = web3.eth.getBalance(giver);

    // Call claimRefund()
    let crTransaction = await cs.claimRefund(0, {from: giver, gasPrice: gasPrice});
    const crGasPaid = web3.toBigNumber(crTransaction.receipt.gasUsed).times(gasPrice);

    // Get post-refund balance
    const postRefund = web3.eth.getBalance(giver);

    assert.isTrue(postRefund.minus(preRefund).plus(crGasPaid).equals(amtGiven), "giver should have a higher balance after claiming a refund");
  });
});
