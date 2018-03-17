# CaiShen

This Ethereum smart contract is a time-locked trust fund marketed as smart [red
packet](https://en.wikipedia.org/wiki/Red_envelope). The contract has been deployed
to the Ropsten testnet and mainnet. You can interact with it using any
MetaMask-enabled browser.

## Dependencies

```bash
sudo apt install git python3 build-essential curl
```

Next, install Yarn using these instructions: https://yarnpkg.com/en/docs/install


## Web Frontend

The source code for the web frontend can be found in the `web` directory. It is a `preact` app
and is served through a Django webserver.

To build the frontend and deploy it to Heroku, set up a Heroku app and create a
git remote named `heroku` which points towards:

```
https://git.heroku.com/<your Heroku app name>.git
```
(See this guide for more information: https://devcenter.heroku.com/articles/git)

Set the `DJ_SECRET_KEY` config variable in the Heroku app dashboard to a long
and random string (https://dashboard.heroku.com/apps -> Name of the app ->Settings -> Config Variables). This will be used as 
the [secret key](https://docs.djangoproject.com/en/2.0/ref/settings/#std:setting-SECRET_KEY) in Django's `settings.py`.

Then install build dependencies and run `build_and_deploy.sh`:

```bash
sudo yarn global add gulp
cd web/app/frontend
yarn install
cd ../../..
./build_and_deploy.sh <commit message>
```

`build_and_deploy.sh` uses `gulp` to build and package the JS frontend, and
then pushes the Django project to Heroku.

## Smart Contract


Install the Truffle Framework:

```
sudo yarn global add truffle
```

Finally, install [Ganache](http://truffleframework.com/ganache/).

### Clone the repository

```
git clone git@gitlab.com:weijiekoh/caishen.git &&
cd caishen &&
yarn install
```

### Run tests

Launch Ganache and run:

```
truffle test
```

You may encounter compilation errors if your Solidity compiler is newer than that which was originally used to build this contract:

```
CaiShen.sol:1:1: SyntaxError: Source file requires different compiler version (current compiler is 0.4.19+commit.c4cbbb05.Emscripten.clang - note that nightly builds are considered to be strictly less than the released version    
pragma solidity 0.4.18;                    
^---------------------^                    
Compilation failed. See above. 
```

If you see this error, modify the contract code to use the latest version of
Solidity.

It's a good idea to restart Ganache (Settings -> Restart) before each time you
run `truffle test`.

Note that `truffle test` is not deterministic. If any tests fail, restart
Ganache and run each failing test individually. For example:

```
truffle test test/test_give.js
```

One solution to this is to use `ganache-cli` instead, as it is much more stable
than the GUI version.
