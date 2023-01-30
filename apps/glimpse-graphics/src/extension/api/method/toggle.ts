import {Replicant} from "nodecg-types/types/server";
import {Request, Response} from "express"
import {replicants} from "../../util/replicants";
import {apiResponse} from "../api"

function toggleOption(res: Response, option: Replicant<boolean>) {
	option.value = !option.value;
	apiResponse(res, 200, `toggled ${option.namespace} to ${option.value}`)
}

export const endpoints: { [key: string]: Replicant<boolean> } = {
	"lt-scoreboard": replicants.lowerThird.scoreboard,
	"lt-locator": replicants.lowerThird.locator,
	"bug": replicants.lowerThird.bug,
	"end-credits": replicants.lowerThird.endGraphics.show,
	"commentators": replicants.lowerThird.commentators.show,
	"main-scoreboard": replicants.scoreboard.visible
}

/**
 * Inverts a boolean type replicant.
 * @param req Express request
 * @param res Express Response
 * @param endpoint the key within "endpoints" to toggle
 */
export function handleToggle(req: Request, res: Response, endpoint: string): void {
	if (!endpoints[endpoint]) {
		apiResponse(res, 400, "invalid endpoint");
	} else {
		toggleOption(res, endpoints[endpoint]);
	}
}

