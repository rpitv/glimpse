import {Request, Response} from "express";
import {apiResponseV1} from "../api";
import {replicants} from "../../util/replicants";

// /football/clock_info/down/yards_to_go/possession
function setFootballInfo(req: Request, res: Response) {
	if (Object.keys(req.params).length < 3) {
		apiResponseV1(res, 400, "missing params: /football/clock_info/down/yards_to_go/possession");
		return;
	}

	try {
		const down = parseInt(req.params.param1);
		if (isNaN(down))
			throw new Error()

		const yards = req.params.param2;
		const possession = req.params.param3;

		replicants.scoreboard.down.value = down;
		replicants.scoreboard.yardsToGo.value = yards;
		replicants.scoreboard.possession.value = possession;
		apiResponseV1(res, 200, `updated board to DOWN:${down}, Yard: ${yards}, Possession: ${possession}`);
	} catch (e) {
		apiResponseV1(res, 400, "error parsing url");
	}
}


// /football/clock_adj/[up1|down1]
function setClockChange(req: Request, res: Response) {
	if (Object.keys(req.params).length < 1) {
		apiResponseV1(res, 400, "missing params: /football/clock_adj/[up1|down1]");
		return;
	}

	if (req.params.param1 === "up1") {
		console.log("increment clock by 1")
		replicants.scoreboard.clock.time.value += 1000;
		apiResponseV1(res, 200, "increment clock by 1")
	} else if (req.params.param1 === "down1") {
		replicants.scoreboard.clock.time.value -= 1000;
		console.log("decrement clock by 1")
		apiResponseV1(res, 200, "decrement clock by 1")
	} else {
		apiResponseV1(res, 400, "invalid param")
	}
}

// /football/score/[team1|team2]/[int]
function setScore(req: Request, res: Response) {
	if (Object.keys(req.params).length < 2) {
		apiResponseV1(res, 400, "missing params: /football/score/[team1|team2]/[int]");
		return;
	}

	try {
		const team = req.params.param1;
		const score = parseInt(req.params.param2);

		if (team === "team1") {
			replicants.teams[0].score.value += score;
			apiResponseV1(res, 200, `increased score of team 1 by ${score}`)
		} else if (team === "team2") {
			replicants.teams[1].score.value += score;
			apiResponseV1(res, 200, `increased score of team 2 by ${score}`)
		} else {
			apiResponseV1(res, 400, `unknown team ${team}`)
		}
	} catch (e) {
		apiResponseV1(res, 400, "error parsing url");
	}
}

export const endpointsFootball: { [key: string]: (req: Request, res: Response) => void } = {
	"clock_info": (req, res) => setFootballInfo(req, res),
	"clock_adj": (req, res) => setClockChange(req, res),
	"score": (req, res) => setScore(req, res),
}


/**
 * Handles clock modification use with care. <br>
 * @see the corresponding endpoint for further details on each endpoint's specific parameters.
 *
 * @param req Express request
 * @param res Express response
 * @param endpoint the endpoint which handles the request
 */
export function handleFootball(req: Request, res: Response, endpoint: string): void {
	if (!endpointsFootball[endpoint]) {
		apiResponseV1(res, 400, `invalid endpoint in football '${endpoint}'`);
	} else {
		endpointsFootball[endpoint](req, res);
	}
}
