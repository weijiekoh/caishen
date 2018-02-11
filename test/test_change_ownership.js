const CaiShen = artifacts.require("./CaiShen.sol");
const expectThrow = require("./expectThrow.js");

contract('CaiShen', accounts => {
  const creator = accounts[0];
  const giver = accounts[1];
  const recipient = accounts[2];
  const newOwner = accounts[3];
  const notOwner = accounts[4];
  const amount = web3.toWei(4, "ether");
  const fee = web3.toWei(0.04, "ether");
  const gasPrice = web3.toBigNumber(10000000000);

  it("should not let a non-owner collect fees", async () => {
    let cs = await CaiShen.new();
    const expiry = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 10;

    await cs.give(recipient, expiry, "name", "message", {to: cs.address, from: giver, value: amount});

    // Collect all fees. This transfers the cumulative fees collected to the
    // contract owner.
    const result = await expectThrow(cs.collectAllFees({from: notOwner, gasPrice: gasPrice}));

    assert.isTrue(result, "collectAllFees() should throw becasue notOwner is not the owner");
  });

  it("should let the new owner collect fees", async () => {
    let cs = await CaiShen.new();
    const expiry = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 10;

    await cs.give(recipient, expiry, "name", "message", {to: cs.address, from: giver, value: amount});

    // Check if feesGathered is correct
    const feesGathered = await cs.feesGathered({from: creator});
    assert.equal(feesGathered.equals(fee), true, "Total fees collected should be correct");

    const a = await cs.feesGathered();
    assert.equal(a.equals(fee), true, "feesGathered() should return the correct fee");

    // Change ownership
    await cs.transferOwnership(newOwner, {from: creator});

    const initial = web3.eth.getBalance(newOwner);

    // Collect all fees. This transfers the cumulative fees collected to the
    // contract owner.
    let transaction = await cs.collectAllFees({from: newOwner, gasPrice: gasPrice});

    const post = web3.eth.getBalance(newOwner);

    // Calculate gas paid
    const gasUsed = web3.toBigNumber(transaction.receipt.gasUsed);
    const gasPaid = gasUsed.times(gasPrice);

    // Check if feesGathered is correct
    const b = await cs.feesGathered();
    assert.equal(b.equals(0), true, "feesGathered() should return 0");

    // Check if the balance is correct, accounting for the gas paid
    assert.equal(post.plus(gasPaid).minus(initial).equals(fee), true, "Fees and gasPaid should add up");
  });
});
