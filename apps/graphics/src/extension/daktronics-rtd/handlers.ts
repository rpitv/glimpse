import {replicants} from "../util/replicants";
import {logger} from "../util/logger";
import {announcementTimersTick} from "../scoreboard-clock";
import * as repl from "repl";

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
	if(!replicants.sync.values.teams[0].shots.value) {
		logger.trace('Home shots on goal sync is disabled, ignoring home shots on goal update');
		return;
	}

	replicants.teams[0].shots.value = parseInt(value, 10) || 0;
}

export function awayShotHandler(value: string): void {
	if(!replicants.sync.values.teams[1].shots.value) {
		logger.trace('Away shots on goal sync is disabled, ignoring away shots on goal update');
		return;
	}

	replicants.teams[1].shots.value = parseInt(value, 10) || 0;
}

export function homePenalty1Handler(value: string): void {
	const data = value.split(" ");
	replicants.teams[0].player1PenaltyNumber.value = data[0] || "";
	replicants.teams[0].player1PenaltyClock.value = data[1] || "";
}
export function homePenalty2Handler(value: string): void {
	const data = value.split(" ");
	replicants.teams[0].player2PenaltyNumber.value = data[0] || "";
	replicants.teams[0].player2PenaltyClock.value = data[1] || "";
}
export function awayPenalty1Handler(value: string): void {
	const data = value.split(" ");
	replicants.teams[1].player1PenaltyNumber.value = data[0] || "";
	replicants.teams[1].player1PenaltyClock.value = data[1] || "";
}
export function awayPenalty2Handler(value: string): void {
	const data = value.split(" ");
	replicants.teams[1].player2PenaltyNumber.value = data[0] || "";
	replicants.teams[1].player2PenaltyClock.value = data[1] || "";
}

export function timeoutsHandler(value: string): void {
	if (!replicants.sync.values.teams[0].timeouts.value) {
		logger.trace('Timeout sync is disabled, ignoring penalty updates');
		return;
	}

	replicants.teams[0].timeouts.value = parseInt(value.split(" ")[0]);
	replicants.teams[1].timeouts.value = parseInt(value.split(" ")[4]);
}

export function playClockHandler(value: string): void {
	if (!replicants.gameSettings.football.playClock) {
		logger.trace('Play clock sync is disabled, ignoring penalty updates');
		return;
	}

	replicants.scoreboard.playClock.value = parseInt(value);
}

export function possessionHandler(value: string): void {
	if (!replicants.sync.values.football.possession.value) {
		logger.trace('Possession sync is disabled, ignoring possession updates');
		return;
	}

	replicants.scoreboard.possession.value = value.split("")[0];
}

export function downHandler(value: string): void {
	if (!replicants.gameSettings.football.downs.value) {
		logger.trace('Down sync is disabled, ignoring down updates');
		return;
	}

	replicants.scoreboard.down.value = parseInt(value);
}

export function yardsToGoHandler(value: string): void {
	if (!replicants.gameSettings.football.yardsToGo.value) {
		logger.trace('Yards to go sync is disabled, ignoring yards to go updates');
		return;
	}

	replicants.scoreboard.yardsToGo.value = value;
}
