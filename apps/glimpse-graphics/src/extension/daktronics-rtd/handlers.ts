import {replicants} from "../util/replicants";

export function mainClockHandler(value: string) {
	if(!replicants.gameSettings.clock.synced.value) {
		return;
	}
	// Less than a minute left
	if(value.includes('.')) {
		replicants.scoreboard.clock.time.value = parseFloat(value) * 1000
	} else {
		const [minutes, seconds] = value.split(':');
		replicants.scoreboard.clock.time.value = (parseInt(minutes, 10) * 60 + parseInt(seconds, 10)) * 1000;
	}
}
