const CaiShen = artifacts.require("./CaiShen.sol");
const expectThrow = require("./expectThrow.js");

contract('CaiShen', accounts => {
  const creator = accounts[0];
  const giver = accounts[1];
  const recipient = accounts[2];
  const amount = web3.toWei(5, "ether");
  const gasPrice = web3.toBigNumber(10000000000);

  it("should fail to return funds if allowRefunds() is not invoked first", async () => {
    let cs = await CaiShen.new();
    const expiry = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 3000;
    let transaction = await cs.give(recipient, expiry, {to: cs.address, from: giver, value: amount, gasPrice: gasPrice});
    let result = await expectThrow(cs.claimRefund(0, {from: giver, gasPrice: gasPrice}));
    assert.isTrue(result, false, "claimRefund() should throw");
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

  //it("should not return funds if called by a non-owner", async () => {
    //let cs = await CaiShen.new();

    //let result = await expectThrow(cs.returnFundsToGivers({from: recipient}));

    //assert.equal(result, true, "returnFundsToGivers() should throw an error because it was called by a different account");
  //});


  //it("should return funds", async () => {
    //let cs = await CaiShen.new();
    //const expiry = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 10;

    //// Call give()
    //const preGive = web3.eth.getBalance(giver);
    //let transaction = await cs.give(recipient, expiry, {to: cs.address, from: giver, value: amount, gasPrice: gasPrice});
    //const postGive = web3.eth.getBalance(giver);

    //const gasUsed = web3.toBigNumber(transaction.receipt.gasUsed);
    //const gasPaid = gasUsed.times(gasPrice);

    //assert.isTrue(preGive.minus(postGive).minus(gasPaid).equals(web3.toBigNumber(amount)), "giver should have a lower balance after giving");

    //// Call returnFundsToGivers()
    //const preRefund = web3.eth.getBalance(giver);
    //let refundTransaction = await cs.returnFundsToGivers({from: creator});
    //const postRefund = web3.eth.getBalance(giver);

    //const fee = await cs.fee(amount);
    //assert.isTrue(postRefund.minus(preRefund).plus(fee).equals(amount), "giver should have amount-fee balance after giving");
  //});

  //it("should return funds to multiple givers", async () => {
    //let cs = await CaiShen.new();
    //const expiry = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 10;

    //const amount1 = web3.toWei(5, "ether");
    //const amount2 = web3.toWei(0.02, "ether");
    //const amount3 = web3.toWei(0.003, "ether");

    //const fee1 = await cs.fee(amount1);
    //const fee2 = await cs.fee(amount2);
    //const fee3 = await cs.fee(amount3);

    //const giver1 = accounts[3];
    //const giver2 = accounts[4];
    //const giver3 = accounts[5];

    //const recipient1 = accounts[6];
    //const recipient2 = accounts[7];
    //const recipient3 = accounts[8];

    //const preBalance1 = web3.eth.getBalance(giver1);
    //const preBalance2 = web3.eth.getBalance(giver2);
    //const preBalance3 = web3.eth.getBalance(giver3);

    //// Call give() multiple times
    //await cs.give(recipient1, expiry, {to: cs.address, from: giver1, value: amount1, gasPrice: gasPrice});
    //await cs.give(recipient2, expiry, {to: cs.address, from: giver2, value: amount2, gasPrice: gasPrice});
    //await cs.give(recipient3, expiry, {to: cs.address, from: giver3, value: amount3, gasPrice: gasPrice});

    //const preRefund1 = web3.eth.getBalance(giver1);
    //const preRefund2 = web3.eth.getBalance(giver2);
    //const preRefund3 = web3.eth.getBalance(giver3);

    //// Call returnFundsToGivers()
    //await cs.returnFundsToGivers({from: creator});

    //const postRefund1 = web3.eth.getBalance(giver1);
    //const postRefund2 = web3.eth.getBalance(giver2);
    //const postRefund3 = web3.eth.getBalance(giver3);

    //// Check if the refunds are successful
    //assert.isTrue(postRefund1.minus(preRefund1).plus(fee1).equals(amount1), "giver1 should have amount-fee balance after giving");
    //assert.isTrue(postRefund2.minus(preRefund2).plus(fee2).equals(amount2), "giver2 should have amount-fee balance after giving");
    //assert.isTrue(postRefund3.minus(preRefund3).plus(fee3).equals(amount3), "giver3 should have amount-fee balance after giving");
  //});
});
