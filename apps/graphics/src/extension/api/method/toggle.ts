import {Replicant} from "nodecg-types/types/server";
import {Request, Response} from "express"
import {replicants} from "../../util/replicants";
import {apiResponseV1} from "../api"

function toggleOption(req: Request, res: Response, option: Replicant<boolean>) {
	if (req.params.param1) {
		if (req.params.param1 === "true") {
			option.value = true;
		} else if (req.params.param1 === "false") {
			option.value = false;
		}
	} else {
		option.value = !option.value;
	}
	apiResponseV1(res, 200, `toggled [${option.namespace}] (${option.name}) to ${option.value}`);
}

export function forceReload(req: Request, res: Response) {
	const option = replicants.gameSettings.api.forceReload;
	option.value = true;
	apiResponseV1(res, 200, "refreshed all instances of 'glimpse.html'");

	setTimeout(() => {
		option.value = false;
	}, 1000);
}

export const endpointsToggle: { [key: string]: Replicant<boolean> } = {
	"bug": replicants.lowerThird.bug,
	"commentators": replicants.lowerThird.commentators.show,
	"copyright": replicants.lowerThird.showCopyright,
	"end-credits": replicants.lowerThird.endGraphics.show,
	"lt-locator": replicants.lowerThird.locator,
	"lt-scoreboard": replicants.lowerThird.scoreboard,
	"main-scoreboard": replicants.scoreboard.visible,
	"sogs": replicants.sync.values.sogs,
	"team_1_enable": replicants.teams[0].enabled,
	"team_2_enable": replicants.teams[1].enabled
}

/**
 * Inverts a boolean type replicant.
 * @param req Express request
 * @param res Express response
 * @param endpoint the key within "endpoints" to toggle
 */
export function handleToggle(req: Request, res: Response, endpoint: string): void {
	if (endpoint === "force-reload") {
		forceReload(req, res);
		return;
	}

	if (!endpointsToggle[endpoint]) {
		apiResponseV1(res, 400, "invalid endpoint");
	} else {
		toggleOption(req, res, endpointsToggle[endpoint]);
	}
}

