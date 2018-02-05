# CaiShen

This Ethereum smart contract is a time-locked trust fund marketed as smart [red
packet](https://en.wikipedia.org/wiki/Red_envelope). The contract has been deployed
to the Ropsten testnet. You can interact with it using any MetaMask-enabled browser.

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
