import { get as nodecg } from './util/nodecg';
import {clockTimeRep, isClockRunningRep} from './util/replicants';

let scoreboardTimer: NodeJS.Timer | null = null;
let scoreboardTimerLastModified: number | null = null;

nodecg().listenFor('glimpse-graphics_scoreboard_clock_startClock', (): void => {
	isClockRunningRep.value = true;
	scoreboardTimerLastModified = Date.now();

	scoreboardTimer = setInterval(() => {
		// Stop the clock once it hits zero.
		if(clockTimeRep.value <= 0) {
			clockTimeRep.value = 0;
			nodecg().sendMessage('glimpse-graphics_scoreboard_clock_stopClock');
			return;
		}

		// If clock hasn't hit zero yet, update its value.
		const now = Date.now();
		if(scoreboardTimerLastModified !== null) {
			clockTimeRep.value -= now - scoreboardTimerLastModified;
		}
		scoreboardTimerLastModified = now;
	}, 100);
});

nodecg().listenFor('glimpse-graphics_scoreboard_clock_stopClock', (): void => {
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

nodecg().listenFor('glimpse-graphics_scoreboard_clock_setClock', (newClockValue): void => {

});
