# Glimpse Graphics

NodeCG bundle designed for use with the RPI TV Glimpse infrastructure.

Built using the template [nodecg-vue-ts-template](https://github.com/zoton2/nodecg-vue-ts-template). View it's license [here](./TEMPLATE_LICENSE).



## Setup

Requires `node` version 18 and `npm` version 9.

```shell
# installs the parent NodeCG repository
git clone https://github.com/nodecg/nodecg.git
cd nodecg
git reset --hard 2679f0e
npm i
npm run build

# installs glimpse-graphics repository
cd bundles
git clone https://github.com/rpitv/glimpse-graphics.git
cd glimpse-graphics
npm i
```



## Running

Open a terminal to this `glimpse-graphics` folder.

```shell
# TO DEVELOP
npm run dev

# TO RUN IN PRODUCTION
npm run build
npm run start
```



## Updating

Open a terminal to this `glimpse-graphics` folder.

```shell
# downloads any updates
git pull origin
npm i
```
