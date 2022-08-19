import { get as nodecg } from './util/nodecg';
import {clockTimeRep, isClockRunningRep} from './util/replicants';

let scoreboardTimer: NodeJS.Timer | null = null;
let scoreboardTimerLastModified: number | null = null;

nodecg().listenFor('glimpse-graphics.scoreboard.clock.startClock', (): void => {
	isClockRunningRep.value = true;

	if (scoreboardTimer) {
		return; // Clock is already running
	}

	scoreboardTimerLastModified = Date.now();

	scoreboardTimer = setInterval(() => {
		// Stop the clock once it hits zero.
		if(clockTimeRep.value <= 0) {
			nodecg().sendMessage('glimpse-graphics.scoreboard.clock.stopClock');
			return;
		}

		// If clock hasn't hit zero yet, update its value.
		const now = Date.now();
		if(scoreboardTimerLastModified !== null) {
			clockTimeRep.value -= now - scoreboardTimerLastModified;
			if(clockTimeRep.value < 0) {
				clockTimeRep.value = 0;
			}
		}
		scoreboardTimerLastModified = now;
	}, 100);
});

nodecg().listenFor('glimpse-graphics.scoreboard.clock.stopClock', (): void => {
	// Stop the clock if it's running.
	if(isClockRunningRep.value) {
		isClockRunningRep.value = false;
	}
	if(scoreboardTimer !== null) {
		clearInterval(scoreboardTimer);
		scoreboardTimer = null;
	}
	scoreboardTimerLastModified = null;
});
