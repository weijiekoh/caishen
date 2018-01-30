const CaiShen = artifacts.require("./CaiShen.sol");
const expectThrow = require("./expectThrow.js");

contract('CaiShen', accounts => {
  const creator = accounts[0];
  const giver = accounts[1];
  const recipient = accounts[2];
  const amount = web3.toWei(5, "ether");

  it("should return funds", async () => {
    let cs = await CaiShen.new();
  });
});
