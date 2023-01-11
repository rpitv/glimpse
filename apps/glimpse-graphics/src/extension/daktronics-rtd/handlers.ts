import {replicants} from "../util/replicants";
import {logger} from "../util/logger";
import {announcementTimersTick} from "../scoreboard-clock";

export function mainClockHandler(value: string): void {
	logger.trace({value}, 'mainClockHandler called');
	if(!replicants.sync.values.clock.value) {
		logger.trace('Clock sync is disabled, ignoring clock update');
		return;
	}

	if(replicants.scoreboard.clock.isRunning.value) {
		logger.trace('Clock is manually running but score sync data was received. Stopping manual clock.');
		replicants.scoreboard.clock.isRunning.value = false;
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

	let mins, secs, tenths, minsAndSecs;
	[minsAndSecs, tenths] = value.split('.');
	if(minsAndSecs.indexOf(':') > -1) {
		[mins, secs] = minsAndSecs.split(':')
	} else {
		secs = minsAndSecs;
		mins = '0';
	}
	logger.trace({mins, secs, tenths}, 'Parsed string clock values');

	const [minsInt, secsInt, tenthsInt] = [parseInt(mins) || 0, parseInt(secs) || 0, parseInt(tenths) || 0];
	logger.trace({minsInt, secsInt, tenthsInt}, 'Parsed int clock values');

	replicants.scoreboard.clock.time.value = minsInt * 60000 + secsInt * 1000 + tenthsInt * 100;
	logger.trace({time: replicants.scoreboard.clock.time.value}, 'Updated clock time');

	logger.trace('Running announcement timers tick')
	announcementTimersTick();
}

export function homeScoreHandler(value: string): void {
	logger.trace({value}, 'homeScoreHandler called');

	if(!replicants.sync.values.teams[0].score.value) {
		logger.trace('Home score sync is disabled, ignoring home score update');
		return;
	}

	replicants.teams[0].score.value = parseInt(value, 10) || 0;
}

export function awayScoreHandler(value: string): void {
	logger.trace({value}, 'awayScoreHandler called');

	if(!replicants.sync.values.teams[1].score.value) {
		logger.trace('Away score sync is disabled, ignoring away score update');
		return;
	}

	replicants.teams[1].score.value = parseInt(value, 10) || 0;
}

export function periodHandler(value: string): void {
	logger.trace({value}, 'periodHandler called');

	if(!replicants.sync.values.period.value) {
		logger.trace('Period sync is disabled, ignoring period update');
		return;
	}

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

export function homeShotHandler(value: string): void {
	logger.trace({value}, 'homeShotHandler called');
	if(!replicants.sync.values.teams[0].shots.value) {
		logger.trace('Home shots on goal sync is disabled, ignoring home shots on goal update');
		return;
	}

	logger.debug(`SOG Home: ${value}`)

	replicants.teams[0].shots.value = parseInt(value, 10) || 0;
}

export function awayShotHandler(value: string): void {
	logger.trace({value}, 'awayShotHandler called');
	if(!replicants.sync.values.teams[1].shots.value) {
		logger.trace('Away shots on goal sync is disabled, ignoring away shots on goal update');
		return;
	}

	logger.debug(`SOG Away: ${value}`)
	replicants.teams[1].shots.value = parseInt(value, 10) || 0;
}