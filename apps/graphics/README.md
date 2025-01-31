# Glimpse Graphics

NodeCG bundle designed for use with the RPI TV Glimpse infrastructure.

Built using the template [nodecg-vue-ts-template](https://github.com/zoton2/nodecg-vue-ts-template). View it's license [here](./TEMPLATE_LICENSE).



## Setup

Requires `node` version 18 and `npm` version 10.7.0

*Note: Higher `node` versions might be compatible and may require `Visual Studio` with the `Desktop development with C++` 
package installed to compile `better-sqlite3` via `node-gyp`. 
This error message will show up when applicable during dependency installation.*

```shell
# clone the monorepo
git clone https://github.com/rpitv/glimpse.git

cd glimpse/apps/graphics

# installs graphics dependencies
npm install --no-workspaces
```



## Running
### Production
For production, this compiles/builds the code then starts NodeCG.
```shell
npm run start
```

### Development
For developing, this will start `vite` then NodeCG allowing for hot reloading.
```shell
npm run dev
```

The app can be accessed by opening a web browser to `localhost:9090` or replacing `localhost` with the server's IP address. 
This can be found with `ipconfig` in Windows and `ip a | grep inet` in Unix.

## Issues
Use the `Issues` tab and `Create New` with the appropriate category. Be sure in the `Labels` section on the right side to select `Module: Graphics` with the `Issue`.
