import { get as nodecg } from './util/nodecg';
import {replicants} from "./util/replicants";

let scoreboardTimer: NodeJS.Timer | null = null;
let scoreboardTimerLastModified: number | null = null;

nodecg().listenFor('glimpse-graphics.scoreboard.clock.startClock', (): void => {
	replicants.scoreboard.clock.isRunning.value = true;

	if (scoreboardTimer) {
		return; // Clock is already running
	}

	scoreboardTimerLastModified = Date.now();

	scoreboardTimer = setInterval(() => {
		// Stop the clock once it hits zero.
		if(replicants.scoreboard.clock.time.value <= 0) {
			nodecg().sendMessage('glimpse-graphics.scoreboard.clock.stopClock');
			return;
		}

		// If clock hasn't hit zero yet, update its value.
		const now = Date.now();
		if(scoreboardTimerLastModified !== null) {
			replicants.scoreboard.clock.time.value -= now - scoreboardTimerLastModified;
			if(replicants.scoreboard.clock.time.value < 0) {
				replicants.scoreboard.clock.time.value = 0;
			}
		}
		scoreboardTimerLastModified = now;
	}, 100);
});

nodecg().listenFor('glimpse-graphics.scoreboard.clock.stopClock', (): void => {
	// Stop the clock if it's running.
	if(replicants.scoreboard.clock.isRunning.value) {
		replicants.scoreboard.clock.isRunning.value = false;
	}
	if(scoreboardTimer !== null) {
		clearInterval(scoreboardTimer);
		scoreboardTimer = null;
	}
	scoreboardTimerLastModified = null;
});
