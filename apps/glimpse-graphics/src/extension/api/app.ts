import {NodeCG} from "nodecg-types/types/server";
import {replicants} from "../util/replicants";


export = (nodecg: NodeCG): void => {
	const router = nodecg.Router();

	/**
	 * Version 1 of the REST API.
	 * Expects an API key a method and endpoint within the method.
	 */
	router.get(`/v1/:key/:method/:endpoint/*`, (req, res) => {
		if (req.params.key != replicants.gameSettings.api.key.value) {
			res.status(401).json({code: 401, msg: "invalid key"});
			return;
		}

		if (!replicants.gameSettings.api.enabled.value) {
			res.status(401).json({code: 401, msg: "api not enabled"})
			return;
		}

		// todo manage routing
		res.json({"code": 200, "msg": "ok", data: [req.params.key, req.params.method, req.params.endpoint]})
	});

	// return a 403 status since invalid path
	router.get("/*", (req, res) => {
		res.status(403).json({code: 403, msg: "invalid path"})
	});

	// mounts base router url at "localhost:PORT/glimpse-graphics-api"
	nodecg.mount("/glimpse-graphics-api", router);
};



