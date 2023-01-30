import {Request, Response} from "express";
import {endpoints} from "./toggle";

/**
 * Returns JSON of all endpoints.
 *
 * @note When a new method is created, it needs to be added to the methods object in the response.
 * @param req Express request object
 * @param res Express response object
 * @param endpoint string of endpoint within docs, currently unused but for consistency in index.ts
 */
export function handleDocs(req: Request, res: Response, endpoint: string): void {
	res.status(200).json({
		code: 200,
		msg: "documentation",
		data: {
			methods: {
				docs: ["/"],
				toggle: Object.keys(endpoints)
			}
		}
	});
}
