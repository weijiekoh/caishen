# CaiShen

This Ethereum smart contract is a time-locked trust fund marketed as smart [red
packet](https://en.wikipedia.org/wiki/Red_envelope).


You must have Yarn on your system. Install it if you haven't already using the
instructions [here](https://yarnpkg.com/en/docs/install).

Once you have installed Yarn, install the Truffle Framework.

```
sudo yarn global add truffle
```

Finally, install [Ganache](http://truffleframework.com/ganache/).

### Clone the repository

```
git clone git@gitlab.com:weijiekoh/dajidali.git &&
cd dajidali &&
yarn install
```

### Run tests

Launch Ganache and run:

```
truffle test
```

It's a good idea to restart Ganache (Settings -> Restart) before each time you
run `truffle test`.

Note that `truffle test` is not deterministic. If any tests fail, restart
Ganache and run each failing test individually. For example:

```
truffle test test/test_change_recipient.js
```
