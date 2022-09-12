import {replicants} from "./util/replicants";

let scoreboardTimer: NodeJS.Timer | null = null;
let scoreboardTimerLastModified: number | null = null;

replicants.scoreboard.clock.isRunning.on('change', (newValue: boolean) => {
	// If isRunning is set to true, but the clock is already running, or vice versa, then do nothing.
	if((newValue && scoreboardTimer !== null) || (!newValue && scoreboardTimer === null)) {
		return;
	}

	if(newValue) {
		scoreboardTimerLastModified = Date.now();

		scoreboardTimer = setInterval(() => {
			// Stop the clock once it hits zero.
			if(replicants.scoreboard.clock.time.value <= 0) {
				replicants.scoreboard.clock.isRunning.value = false;
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
	} else {
		if(scoreboardTimer !== null) {
			clearInterval(scoreboardTimer);
			scoreboardTimer = null;
		}
		scoreboardTimerLastModified = null;
	}
})
