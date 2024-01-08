import {Request, Response} from "express";
import {apiFatalPanik, apiResponseV1} from "../api";
import {replicants} from "../../util/replicants";
import {Replicant} from "nodecg-types/types/server";

/**
 * Handles changing the score for both teams. <br>
 *
 * <br> /v1/:key/:method/:endpoint/:param1/:param2
 * <br> :param1 is the team to change the score of (team1 | team2)
 * <br> :param2 is the score to change or set by
 *
 * @param req Express request
 * @param res Express response
 * @param deltaType "enums" to increase, lower, or set the score
 */
function setScore(req: Request, res: Response, deltaType: "up" | "down" | "set") {
	const team = req.params.param1;
	if (!team) {
		apiResponseV1(res, 400, "missing team to set score for");
		return;
	}

	// ensure team param exists and valid
	let teamReplicant: Replicant<number> | null = null;
	if (team === "team1") {
		teamReplicant = replicants.teams[0].score;
	} else if (team === "team2") {
		teamReplicant = replicants.teams[1].score;
	} else {
		apiResponseV1(res, 400, `invalid team: '${team}' (team1 | team2)`);
		return;
	}
	const oldScore = teamReplicant.value;

	// ensure score is a parseable integer
	const deltaScore = req.params.param2;
	if (!deltaScore) {
		apiResponseV1(res, 400, "missing score number to change or set");
		return;
	}
	if (isNaN(Number(deltaScore))) {
		apiResponseV1(res, 400, `score '${deltaScore}' can not be parsed into an integer.`);
		return;
	}

	// finally changes the score within the corresponding team
	if (deltaType === "up") {
		teamReplicant.value = teamReplicant.value + Number(deltaScore);
	} else if (deltaType === "set") {
		teamReplicant.value = Number(deltaScore);
	} else if (deltaType === "down") {
		teamReplicant.value = teamReplicant.value - Number(deltaScore);
	} else {
		const msg = `score#setScore(delta: ${deltaType}) illegal state`;
		apiFatalPanik(req, res, msg);
		console.trace(msg)
		return;
	}
	apiResponseV1(res, 200, `Changed team '${team}' score '${deltaType}' from '${teamReplicant.value}' to '${oldScore}'}`);
}

// NOTE: Endpoints are currently only GET requests for simple implementation within other software.
export const endpointsScore: { [key: string]: (req: Request, res: Response) => void } = {
	"down": (req, res) => setScore(req, res, "down"),
	"up": (req, res) => setScore(req, res, "up"),
	"set": (req, res) => setScore(req, res, "set"),
}

/**
 * Handles changing the score of specific teams. <br>
 *
 * <br> /v1/:key/:method/:endpoint/:param1/:param2
 * <br> :param1 is the team to change the score of (team1 | team2)
 * <br> :param2 is the score to change or set by
 *
 * @param req Express request
 * @param res Express response
 * @param endpoint the endpoint to change the score at
 */
export function handleScore(req: Request, res: Response, endpoint: string): void {
	if (!endpointsScore[endpoint]) {
		apiResponseV1(res, 400, `invalid endpoint in score '${endpoint}'`);
	} else {
		endpointsScore[endpoint](req, res);
	}
}
