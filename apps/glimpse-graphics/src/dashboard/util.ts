/**
 * Parse an input time string into milliseconds.
 * @param time String to parse. Expected to be in one of the following forms:
 *   - mm:ss
 *   - mm:ss.S
 *   - ss.S
 *   - ss
 *   All time segments must also be non-negative.
 *
 * @throws Error if the input time string is not valid and cannot be parsed.
 */
export function parseTimeString(time: string): number {
	let minutesStr = '0';
	let secondsAndMillisStr = '0.0';
	if(time.includes(':')) {
		[minutesStr, secondsAndMillisStr = '0.0'] = time.split(':', 2);
	} else {
		secondsAndMillisStr = time;
	}

	let secondsStr = '0';
	let millisStr = '0';
	if(secondsAndMillisStr.includes('.')) {
		[secondsStr, millisStr = '0'] = secondsAndMillisStr.split('.', 2);
	} else {
		secondsStr = secondsAndMillisStr;
	}

	const minutes = parseInt(minutesStr);
	const seconds = parseInt(secondsStr);
	const millis = parseInt(millisStr);

	if(isNaN(minutes) || isNaN(seconds) || isNaN(millis)) {
		throw new Error(`Input ${time} is not a valid clock input. Input should be in the form "mm:ss.S".`);
	}

	if(minutes < 0 || seconds < 0 || millis < 0) {
		throw new Error(`Input time cannot be negative or contain negative numbers.`);
	}

	return minutes * 60000 + seconds * 1000 + millis * (1000 / (10 ** (millisStr.length)))
}

/**
 * Convert millisecond-based time to a game clock string, i.e. the format mm:ss.S.
 * @param time Time in milliseconds to convert.
 */
export function millisToString(time: number) {
	const minutes = Math.floor(time / 60000).toString(10).padStart(2, '0');
	const seconds = Math.floor((time % 60000) / 1000).toString(10).padStart(2, '0');
	const millis = Math.floor((time % 1000) / 100).toString(10);

	if(time < 60000) {
		return `${seconds}.${millis}`;
	} else {
		return `${minutes}:${seconds}.${millis}`;
	}
}
