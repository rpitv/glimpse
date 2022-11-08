import {replicants} from "../util/replicants";
import {logger} from "../util/logger";

export function mainClockHandler(value: string): void {
	logger.trace({value}, 'mainClockHandler called');
	if(!replicants.gameSettings.clock.synced.value) {
		logger.trace('Clock sync is disabled, ignoring clock update');
		return;
	}

	// Clock is considered disabled whenever a blank value is sent. Conversely, it is considered enabled whenever a
	//   non-blank value is sent.
	if(value.length === 0 && replicants.gameSettings.clock.enabled.value) {
		logger.trace('Blank clock value received, disabling the clock.');
		replicants.gameSettings.clock.enabled.value = false;
	} else if(value.length > 0 && !replicants.gameSettings.clock.enabled.value) {
		logger.trace('Non-blank clock value received, enabling the clock.');
		replicants.gameSettings.clock.enabled.value = true;
	}

	const [minsAndSecs, tenths] = value.split('.');
	const [mins, secs] = minsAndSecs.split(':')
	logger.trace({mins, secs, tenths}, 'Parsed string clock values');

	const [minsInt, secsInt, tenthsInt] = [parseInt(mins) || 0, parseInt(secs) || 0, parseInt(tenths) || 0];
	logger.trace({minsInt, secsInt, tenthsInt}, 'Parsed int clock values');

	replicants.scoreboard.clock.time.value = minsInt * 60000 + secsInt * 1000 + tenthsInt * 100;
	logger.trace({time: replicants.scoreboard.clock.time.value}, 'Updated clock time');
}

export function homeScoreHandler(value: string): void {
	logger.trace({value}, 'homeScoreHandler called');
	replicants.teams[0].score.value = parseInt(value, 10) || 0;
}

export function awayScoreHandler(value: string): void {
	logger.trace({value}, 'awayScoreHandler called');
	replicants.teams[1].score.value = parseInt(value, 10) || 0;
}

export function periodHandler(value: string): void {
	logger.trace({value}, 'periodHandler called');

	// Periods are considered disabled whenever a blank value is sent. Conversely, they are considered enabled whenever
	//   a non-blank value is sent.
	if(value.length === 0 && replicants.gameSettings.periods.enabled.value) {
		logger.trace('Blank period value received, disabling periods.');
		replicants.gameSettings.periods.enabled.value = false;
	} else if(value.length > 0 && !replicants.gameSettings.periods.enabled.value) {
		logger.trace('Non-blank period value received, enabling periods.');
		replicants.gameSettings.periods.enabled.value = true;
	}

	replicants.scoreboard.period.value = parseInt(value, 10) || 1;
}
