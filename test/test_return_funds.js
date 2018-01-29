const CaiShen = artifacts.require("./CaiShen.sol");
const expectThrow = require("./expectThrow.js");

contract('CaiShen', accounts => {
  const creator = accounts[0];
  const giver = accounts[1];
  const recipient = accounts[2];
  const amount = web3.toWei(5, "ether");
  const fee = web3.toWei(0.005, "ether");
  const gasPrice = web3.toBigNumber(10000000000);

  it("should not return funds if called by a non-owner", async () => {
    cs = await CaiShen.new();

    let result = await expectThrow(cs.returnFundsToGivers({from: recipient}));

    assert.equal(result, true, "returnFundsToGivers() should throw an error because it was called by a different account");
  });


  it("should update balances", async () => {
    let cs = await CaiShen.new();
    const expiry = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 10;

    // Call give()
    const preGive = web3.eth.getBalance(giver);
    let transaction = await cs.give(recipient, expiry, {to: cs.address, from: giver, value: amount, gasPrice: gasPrice});
    const postGive = web3.eth.getBalance(giver);

    // Calculate gas paid
    const gasUsed = web3.toBigNumber(transaction.receipt.gasUsed);
    const gasPaid = gasUsed.times(gasPrice);

    assert.isTrue(preGive.minus(postGive).minus(gasPaid).equals(web3.toBigNumber(amount)), "giver should have a lower balance after giving");

    // Call returnFundsToGivers()
    const preRefund = web3.eth.getBalance(giver);
    let refundTransaction = await cs.returnFundsToGivers({from: creator});
    const postRefund = web3.eth.getBalance(giver);

    const refundGasUsed = web3.toBigNumber(refundTransaction.receipt.gasUsed);
    const refundGasPaid = refundGasUsed.times(gasPrice);

    assert.isTrue(postRefund.minus(preRefund).plus(fee).equals(amount), "giver should have amount-fee balance after giving");
  });
});

