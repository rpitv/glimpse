import {Request, Response} from "express";
import {apiResponseV1} from "../api";
import {replicants} from "../../util/replicants";


/**
 * Handles configuring the lower third scoreboard settings.
 *
 * <br> /v1/:key/:method/:endpoint/:param1/:param2/:param3
 * <br> param1 = description
 * <br> param2 = font size
 * <br> param3 = is timer enabled? default false
 *
 * @param req Express request
 * @param res Express response
 */
function handleLowerThirdScoreboard(req: Request, res: Response) {
	if (!req.params.param1) {
		apiResponseV1(res, 400, "missing description, underscores _ will be replaced with spaces. " +
			"config/lt-scoreboard/__DESCRIPTION__/__FONT_SIZE_0.0__/__TIMER_ON__");
		return;
	}

	const description = req.params.param1.replaceAll(/_+/g, " ");
	const size = parseFloat(req.params.param2)
	const timer = !!(req.params.param3 && req.params.param3 === "true");

	const config = replicants.lowerThird.scoreboard.description;
	config.text.value = description;
	if (size != null)
		config.fontSize.value = size;
	config.timer.value = timer;

	apiResponseV1(res, 200, "parsed config", {
		description,
		size,
		timer
	});
}


export const endpointsConfigs: { [key: string]: (req: Request, res: Response) => void } = {
	"lt-scoreboard": handleLowerThirdScoreboard
}

/**
 * Handles modifying configurations of specific items. <br>
 * @see the corresponding endpoint for further details on each endpoint's specific parameters.
 *
 * <br> /v1/:key/:method/:endpoint/:param1/:param2
 *
 * @param req Express request
 * @param res Express response
 * @param endpoint the endpoint which handles the request
 */
export function handleConfig(req: Request, res: Response, endpoint: string): void {
	if (!endpointsConfigs[endpoint]) {
		apiResponseV1(res, 400, `invalid endpoint in announcements '${endpoint}'`);
	} else {
		endpointsConfigs[endpoint](req, res);
	}
}
