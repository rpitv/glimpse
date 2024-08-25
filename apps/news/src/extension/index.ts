/* eslint-disable global-require */

// This must go first so we can use module aliases!
/* eslint-disable import/first */
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { NewsImage } from "@news/types/schemas";

require('module-alias').addAlias('@news', require('path').join(__dirname, '.'));

import type { NodeCG as nodeCG } from 'nodecg-types/types/server';
import NodeCG from "@nodecg/types";
import { set } from './util/nodecg';


export = (nodecg: nodeCG): void => {
  /**
   * Because of how `import`s work, it helps to use `require`s to force
   * things to be loaded *after* the NodeCG context is set.
   */
	const newsImages =	nodecg.Replicant<NewsImage[]>("newsImages", "news");
	if (!newsImages.value)
		newsImages.value = [];
  set(nodecg);
};
