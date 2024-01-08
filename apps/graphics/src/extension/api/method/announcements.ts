import {Request, Response} from "express";
import {apiResponseV1} from "../api";
import {replicants} from "../../util/replicants";
import {Announcement} from "../../util/Announcement";
import {v4} from "uuid";
import {Replicant} from "nodecg-types/types/server";

/**
 * Convert millisecond-based time to a game clock string, i.e. the format mm:ss.S.
 * @param time Time in milliseconds to convert.
 */
export function millisToString(time: number) {
	if (Math.abs(time) < 60000) {
		const seconds = Math.floor((time % 60000) / 1000).toString(10).padStart(2, '0');
		const millis = Math.floor(Math.abs(time % 1000) / 100).toString(10);
		return `${seconds}.${millis}`;
	} else {
		const minutes = Math.floor(time / 60000).toString(10).padStart(2, '0');
		const seconds = Math.floor(Math.abs(time % 60000) / 1000).toString(10).padStart(2, '0');
		const millis = Math.floor(Math.abs(time % 1000) / 100).toString(10);
		return `${minutes}:${seconds}.${millis}`;
	}
}

export const announcement_global_param1: { [key: string]: string } = {
	"4on4": "4 on 4",
	"3on3": "3 on 3",
	"3on5": "3 on 5",
	"5on3": "5 on 3",
	"empty_net": "Empty Net",
	"official_review": "Official Review",
}

export const announcement_teamSpecific_param2: { [key: string]: { name: string, time: number | null } } = {
	"delayed_penalty": {name: "Delayed Penalty", time: null},
	"power_play_2": {name: "Power Play", time: (2 * 60 * 1000)},
	"power_play_5": {name: "Power Play", time: (5 * 60 * 1000)},
	"pp_2": {name: "PP", time: (2 * 60 * 1000)},
	"pp_5": {name: "PP", time: (5 * 60 * 1000)},
	"man_up_0.5": {name: "Man Up", time: (30 * 1000)},
	"man_up_1": {name: "Man Up", time: (60 * 1000)},
	"man_up_2": {name: "Man Up", time: (2 * 60 * 1000)},
	"man_up_3": {name: "Man Up", time: (3 * 60 * 1000)},
	"man_up_5": {name: "Man Up", time: (5 * 60 * 1000)},
	"timeout": {name: "Timeout", time: null},
};

/**
 * Add an announcement to the appropriate channel and responds to the HTTP request. <br>
 * NOTE: This means the Express response has already been sent here
 * and do NOT send another response further downstream.
 *
 * @param res Express response
 * @param type Is it a global, team1, or team2 Announcement[] being modified?
 * @param messageInput The message string to be displayed.
 * @param timerInput The length of the time to display the announcement for in ms or null for no specified time.
 * @param top If true inserts the new announcement at the top of the queue, default false.
 */
function addAnnouncement(res: Response, type: Replicant<Announcement[]>, messageInput: string, timerInput: number | null, top = false) {
	const newAnnouncement: Announcement = {
		id: v4(),
		message: messageInput,
		type: "info", // TODO allow user to select type
		timer: timerInput ? {
			visible: true,
			startedAt: replicants.scoreboard.clock.time.value,
			length: timerInput,
			timerEndsAction: "removeAnnouncement"
		} : null,
	}

	if (top) {
		type.value = [newAnnouncement, ...type.value];
	} else {
		type.value = [...type.value, newAnnouncement];
	}
	apiResponseV1(res, 200, `created announcement '${messageInput}' in '${type.name}'`);
}

/**
 * Removes an announcement for the appropriate section. <br>
 * NOTE: This means the Express response has already been sent here
 * and do NOT send another response further downstream.
 *
 * @param res Express response
 * @param type Is it a global, team1, or team2 Announcement[] being modified?
 * @param bottom If true remove from the bottom of the queue, default false.
 */
function removeOneAnnouncement(res: Response, type: Replicant<Announcement[]>, bottom = false) {
	if (type.value.length === 0) {
		apiResponseV1(res, 200, "there are no messages to remove here");
		return;
	}

	const removed = type.value[bottom ? (type.value.length - 1) : 0]
	if (bottom) {
		type.value.splice(type.value.length - 1, 1);
	} else {
		type.value.splice(0, 1);
	}
	apiResponseV1(res, 200, `removed announcement ${removed.message} w/ ${
		removed.timer ? `${millisToString(removed.timer.length)} left` : "'NO TIME SPECIFIED'"
	} from '${type.name}'`, removed);
}

/**
 * Creates a message specific to each team.<br>
 *
 * <br> /v1/:key/:method/:endpoint/:param1/:param2/:param3
 * <br> param1 is team name (team1 | team2)
 * <br> param2 is the team specific message parameter
 * <br> param3 if is "top" then insert the global message at top of the queue, default inserts at the bottom
 *
 * @param req Express request
 * @param res Express response
 */
function teamSpecific(req: Request, res: Response): void {
	if (!req.params.param1) {
		apiResponseV1(res, 400, "missing destination team (team1 | team2)");
		return;
	}
	if (!req.params.param2) {
		apiResponseV1(res, 400, `missing message to display on team: '${req.params.param1}'`);
		return;
	}

	if (!announcement_teamSpecific_param2[req.params.param2]) {
		apiResponseV1(res, 400, `'${req.params.param2}' is an invalid message to display on team: '${req.params.param1}'`);
		return;
	}

	const top = req.params.param3 === "top";
	const selected = announcement_teamSpecific_param2[req.params.param2];
	if (req.params.param1 === "team1") {
		addAnnouncement(res, replicants.announcements.team1, selected.name, selected.time, top);
	} else if (req.params.param1 === "team2") {
		addAnnouncement(res, replicants.announcements.team2, selected.name, selected.time, top);
	} else {
		apiResponseV1(res, 400, `invalid team '${req.params.param1}'`);
	}
}

/**
 * Handles the global message creation. <br>
 *
 * <br> /v1/:key/:method/:endpoint/:param1/:param2
 * <br> param1 is the global message to display
 * <br> param2 if is "bottom" insert the global message at bottom of the queue, default inserts at the top
 *
 * @param req Express request
 * @param res Express response
 */
function handleGlobal(req: Request, res: Response): void {
	if (!req.params.param1) {
		apiResponseV1(res, 400, "missing global message parameter");
		return;
	}

	const bottom = req.params.param2 === "bottom";
	if (announcement_global_param1[req.params.param1]) {
		addAnnouncement(res, replicants.announcements.global, announcement_global_param1[req.params.param1], null, !bottom);
	} else {
		apiResponseV1(res, 400, `invalid global announcement param: '${req.params.param1}'`);
	}
}

/**
 * Handles removing announcements from each type individually or the entire queue. <br>
 *
 * <br> /v1/:key/:method/:endpoint/:param1/:param2
 * <br> param1 is which announcement queue to remove from
 * <br> param2 is where to remove the announcement (bottom | all)
 *
 * @param req Express request
 * @param res Express response
 */
function handleRemove(req: Request, res: Response): void {
	if (!req.params.param1) {
		apiResponseV1(res, 400, "missing announcement type to remove announcement from (global | team1 | team2)");
		return;
	}

	const announcement_handleRemove_param1: { [key: string]: Replicant<Announcement[]> } = {
		"global": replicants.announcements.global,
		"team1": replicants.announcements.team1,
		"team2": replicants.announcements.team2,
	}

	if (announcement_handleRemove_param1[req.params.param1]) {
		if (req.params.param2 === "all") {
			announcement_handleRemove_param1[req.params.param1].value = [];
			apiResponseV1(res, 200, `removed all controllable messages from ${announcement_handleRemove_param1[req.params.param1].name}`);
		} else {
			const bottom = req.params.param2 === "bottom";
			removeOneAnnouncement(res, announcement_handleRemove_param1[req.params.param1], bottom);
		}
	} else {
		apiResponseV1(res, 400, `invalid announcement type: ${req.params.param1}`)
	}
}

export const endpointsAnnouncements: { [key: string]: (req: Request, res: Response) => void } = {
	"team_specific": teamSpecific,
	"global": handleGlobal,
	"remove": handleRemove,
}

/**
 * Handles creating announcements for global and team specific cases. <br>
 * @see the corresponding endpoint for further details on each endpoint's specific parameters.
 *
 * @param req Express request
 * @param res Express response
 * @param endpoint the endpoint which handles the request
 */
export function handleAnnouncements(req: Request, res: Response, endpoint: string): void {
	if (!endpointsAnnouncements[endpoint]) {
		apiResponseV1(res, 400, `invalid endpoint in announcements '${endpoint}'`);
	} else {
		endpointsAnnouncements[endpoint](req, res);
	}
}
