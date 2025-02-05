/* eslint-disable global-require */

// This must go first so we can use module aliases!

import type {NodeCG} from 'nodecg-types/types/server';
import {set} from './util/nodecg';

export = (nodecg: NodeCG): void => {
	/**
	 * Because of how `import`s work, it helps to use `require`s to force
	 * things to be loaded *after* the NodeCG context is set.
	 */
	set(nodecg);
	require('./daktronics-rtd/sync-controller');
	require('./scoreboard-clock');
	require("./api/api").createApi(nodecg)
	require("./httprequests/livesidearmstats");
    require("./httprequests/remote-fetch").create(nodecg);
};
