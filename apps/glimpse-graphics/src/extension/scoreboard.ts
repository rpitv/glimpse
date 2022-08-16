import { get as nodecg } from './util/nodecg';
import { scoreboardCurrentTimeRep } from './util/replicants';

nodecg().log.info('Extension code working!');

// Access/set a replicant (also see ./util/replicants).
scoreboardCurrentTimeRep.value = 1200 * 1000; // 1200 seconds (20 minutes)
