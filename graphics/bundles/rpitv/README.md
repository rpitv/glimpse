# Glimpse Graphics

NodeCG bundle designed for use with the RPI TV Glimpse infrastructure.

Built using the template [nodecg-vue-ts-template](https://github.com/zoton2/nodecg-vue-ts-template). View it's license [here](TEMPLATE_LICENSE).



## Setup

Requires `node` version 21.15.0 and `npm` version 10.7.0

Let `$BASE` be the root directory to start off with.

```shell
# open a terminal and navigate to the root directory
cd $BASE

# clone the monorepo
git clone https://github.com/rpitv/glimpse.git

# installs the parent NodeCG repository
git clone https://github.com/nodecg/nodecg.git
cd nodecg
git checkout fa977b387e56a49375afb159e356ee64af61f0f9
npm i
npm run build

# installs graphics bundle
cd bundles
# on Windows use xcopy
xcopy ..\..\glimpse\apps\graphics graphics /S /E /K /V /F /I
# on Unix use cp
cp -r -v ../../glimpse/apps/graphics/ ./graphics/

npm i
```



## Running

```shell
cd $BASE/nodecg/bundles/graphics

# TO DEVELOP
npm run dev

# TO RUN IN PRODUCTION
npm run build
npm run start
```
Open a browser to `http://127.0.0.1:9090` for the controller. When on production the controller can be accessed from other devices using the server's IP address.

This can be found with `ipconfig` in Windows and `ip a` in Unix.

## Updating

```shell
cd $BASE/glimpse

# downloads any updates
git pull origin

# on Windows use the following
rmdir ..\nodecg\bundles\graphics\src /s /q
xcopy .\apps\graphics ..\nodecg\bundles\graphics /S /E /K /V /F /I /Y

# on Unix use the following
xcopy .\apps\graphics ..\nodecg\bundles\graphics /S /E /K /V /F /I
cp -r -v ./apps/graphics/ ../../graphics/

# finally change to glimpse directory and install any updates
cd ../nodecg/bundles/graphics/
npm i
```

## Developing
Follow instructions in [Setup](#setup) to setup the environment. Use `npm run dev` and open a browser to `http://127.0.0.1:9090`. Changes to the source files will automatically update. To commit, copy and paste the changed files back to the `$BASE/glimpse/apps/graphics` directory and continue with using Git commit and push.

## Issues
Use the `Issues` tab and `Create New` with the appropriate category. Be sure in the `Labels` section on the right side to select `Module: Graphics` with the `Issue`.
