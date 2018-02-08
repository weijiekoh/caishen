const CaiShen = artifacts.require("./CaiShen.sol");
const expectThrow = require("./expectThrow.js");

contract('CaiShen', accounts => {
  const creator = accounts[0];
  const giver = accounts[1];
  const recipient = accounts[2];
  const amount = web3.toWei(4, "ether");
  const fee = web3.toWei(0.04, "ether");
  const gasPrice = web3.toBigNumber(10000000000);

  it("should not collect if called by a non-owner", async () => {
    cs = await CaiShen.new();

    const expiry = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 1000;

    await cs.give(recipient, expiry, "name", "message", {to: cs.address, from: creator, value: amount});
    let result = await expectThrow(cs.collectAllFees({from: recipient}));

    assert.equal(result, true, "collectAllFees() should throw an error because it was called by a different account");
  });


  it("should collect the correct fees", async () => {
    let cs = await CaiShen.new();
    const expiry = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 10;

    await cs.give(recipient, expiry, "name", "message", {to: cs.address, from: giver, value: amount});

    // Check if feesGathered is correct
    const feesGathered = await cs.feesGathered({from: creator});
    assert.equal(feesGathered.equals(fee), true, "Total fees collected should be correct");

    const a = await cs.feesGathered();
    assert.equal(a.equals(fee), true, "feesGathered() should return the correct fee");

    const initial = web3.eth.getBalance(creator);

    // Collect all fees. This transfers the cumulative fees collected to the
    // contract owner.
    let transaction = await cs.collectAllFees({from: creator, gasPrice: gasPrice});

    const post = web3.eth.getBalance(creator);

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
