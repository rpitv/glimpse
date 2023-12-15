import {replicants} from "./util/replicants";
import {Announcement} from "./util/Announcement";

let scoreboardTimer: NodeJS.Timer | null = null;
let scoreboardTimerLastModified: number | null = null;

replicants.scoreboard.clock.isRunning.on('change', (newValue: boolean) => {
	// If isRunning is set to true, but the clock is already running, or vice versa, then do nothing.
	if((newValue && scoreboardTimer !== null) || (!newValue && scoreboardTimer === null)) {
		return;
	}

	if(newValue) {
		scoreboardTimerLastModified = Date.now();

		scoreboardTimer = setInterval(clockTick, 100);
	} else {
		if(scoreboardTimer !== null) {
			clearInterval(scoreboardTimer);
			scoreboardTimer = null;
		}
		scoreboardTimerLastModified = null;
	}
})

function clockTick() {
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

	announcementTimersTick();

	scoreboardTimerLastModified = now;
}

export function announcementTimersTick() {
	const allAnnouncements = [
		...replicants.announcements.global.value,
		...replicants.announcements.team1.value,
		...replicants.announcements.team2.value,
	]

	for(const announcement of allAnnouncements) {
		if(!announcement.timer) {
			continue;
		}

		const currentClockTime = replicants.scoreboard.clock.time.value;

		const timeRemaining = announcement.timer.length - (announcement.timer.startedAt - currentClockTime);
		if(timeRemaining <= 0) {
			if(announcement.timer.timerEndsAction === "removeAnnouncement") {
				removeAnnouncement(announcement);
			} else if(announcement.timer.timerEndsAction === "removeTimer") {
				announcement.timer = null;
			}
		}
	}
}

function removeAnnouncement(announcement: Announcement) {
	if(replicants.announcements.global.value.find(a => a.id === announcement.id)) {
		replicants.announcements.global.value = replicants.announcements.global.value.filter(a => a !== announcement);
	}
	if(replicants.announcements.team1.value.find(a => a.id === announcement.id)) {
		replicants.announcements.team1.value = replicants.announcements.team1.value.filter(a => a !== announcement);
	}
	if(replicants.announcements.team2.value.find(a => a.id === announcement.id)) {
		replicants.announcements.team2.value = replicants.announcements.team2.value.filter(a => a !== announcement);
	}
}
