import {NodeCG} from "nodecg-types/types/server";
import {Request, Response} from "express"
import {replicants} from "../util/replicants";
import {methods} from "./method";

/**
 * The common API response is a json consisting of the HTTP status code and a short message.
 * @param res express Response object
 * @param code the HTTP status code
 * @param msg a short informative phrase/sentence
 */
export const apiResponse = (res: Response, code: number, msg: string): void => {
	res.status(code).json({code, msg});
};

export const createApi = (nodecg: NodeCG): void => {
	const router = nodecg.Router();
	/**
	 * Version 1 of the REST API.
	 * Expects an API key a method and endpoint within the method.
	 */
	const v1_routes = [
		"/v1/:key/:method/:endpoint*",
		"/v1/:key/:method*",
		"/v1/:key*",
	]
	router.get(v1_routes, (req: Request, res: Response) => {
		if (req.params.key != replicants.gameSettings.api.key.value) {
			apiResponse(res, 401, "invalid key");
		} else if (!replicants.gameSettings.api.enabled.value) {
			apiResponse(res, 403, "api not enabled");
		} else if (!req.params.method) {
			apiResponse(res, 400, "missing method");
		} else if (!req.params.endpoint) {
			// the "docs" method does not require an endpoint
			if (req.params.method === "docs") {
				methods["docs"](req, res, "");
			} else {
				apiResponse(res, 400, "missing endpoint");
			}
		} else if (!methods[req.params.method]) {
			apiResponse(res, 400, "invalid method");
		} else {
			methods[req.params.method](req, res, req.params.endpoint);
		}
	});


	// return a 400 status since invalid path
	router.get("/*", (req: Request, res: Response) => {
		res.status(400).json({code: 400, msg: "invalid path"})
	});

	// mounts base router url at "localhost:PORT/glimpse-graphics-api"
	nodecg.mount("/glimpse-graphics-api", router);
};



