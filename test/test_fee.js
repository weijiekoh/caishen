const CaiShen = artifacts.require("./CaiShen.sol");

contract('CaiShen', accounts => {
  it("should calculate the correct fee", async () => {
    let cs = await CaiShen.new();
    const vals = {
      zero: [web3.toWei(0, "ether"), web3.toWei(0.0, "ether")],

      a: [web3.toWei(1, "ether"),    web3.toWei(0.001, "ether")],
      b: [web3.toWei(5, "ether"),    web3.toWei(0.005, "ether")],

      c: [web3.toWei(0.1, "ether"),  web3.toWei(0.00001, "ether")],
      d: [web3.toWei(0.2, "ether"),  web3.toWei(0.00002, "ether")],

      e: [web3.toWei(0.01, "ether"), web3.toWei(0.0000001, "ether")],
      f: [web3.toWei(0.02, "ether"), web3.toWei(0.0000002, "ether")],

      g: [web3.toWei(0.001, "ether"), web3.toWei(0.0, "ether")],
      h: [web3.toWei(0.002, "ether"), web3.toWei(0.0, "ether")],
    };

    Object.keys(vals).forEach(async v => {
      const result = await cs.fee(vals[v][0]);
      assert.equal(vals[v][1], result.toNumber(), v);
    });
  });
});
