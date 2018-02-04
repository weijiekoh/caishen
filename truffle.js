var HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic = "***REMOVED***";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "***REMOVED***");
      },
      gas: 4000000,
      network_id: 3
    }
  }
};
