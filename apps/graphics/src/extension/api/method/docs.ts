import {Request, Response} from "express";
import {endpointsToggle} from "./toggle";
import {announcement_global_param1, announcement_teamSpecific_param2} from "./announcements";
import {endpointsScore} from "./score";
import path from "path";
import * as fs from "fs-extra";
import {apiFatalPanik} from "../api";

/**
 * Serves the statically generated HTML file of the documentation.
 *
 * @param req Express request object
 * @param res Express response object
 * @param endpoint string of endpoint within docs, currently unused but for consistency in index.ts
 */
export function handleDocs(req: Request, res: Response, endpoint: string): void {
	console.log(req.ip);
	const directory = path.join(__dirname, '..', '_static');
	const filePath = path.join(directory, "_docs.html");
	try {
		res.status(200).sendFile(filePath);
	} catch (e) {
		const msg = `docs.ts#handleDocs() can not send file ${filePath}`;
		console.error(msg);
		apiFatalPanik(req, res, msg);
	}
}

/**
 * Generates the static documentation file when NodeCG inits. It is a simple HTML table.
 */
export async function generateDocs() {
	// generate the beginning HTML code
	const body = [`<html lang="en"><head><title>Glimpse Graphics API</title><style>`,
		"body { text-align: center; font-size: 1vmin; position: relative; }",
		"table { font-size: 2em; text-align: left; position: relative;}",
		"th { text-align: center; background: white; position: sticky; top: 0; }",
		"tr:hover { background: gray; }",
		"table td + td { border-left: 3vw solid white; }",
		"table tr + tr { border-bottom: 10vw solid white; }",
		"tr > td:nth-child(2):hover, .bit-link:hover { cursor: pointer; background: yellow; }",
		".bit-link:hover { cursor: pointer; background: yellow; }",
		"#warn { position: sticky; top: 10; background: yellow; text-align: right; }",
		"</style></head><body>",
		"<noscript><h1 id='warn'>WARNING JAVASCRIPT SHOULD BE ENABLED FOR PROPER FUNCTIONALITY</h1></noscript>",
		"<table><tbody><tr><th>Endpoint</th><th>__URL__</th><th>Click to Copy</th></tr>"];

	// insert global announcements endpoint
	const a_ep_ann_global = Object.keys(announcement_global_param1);
	for (const e in a_ep_ann_global) {
		body.push(`<tr><td>announcements</td><td>announcements/global/${a_ep_ann_global[e]}</td></tr>`);
		body.push(`<tr><td>announcements</td><td>announcements/global/${a_ep_ann_global[e]}/bottom</td></tr>`);
	}

	// insert team specific announcements endpoint
	const a_ep_ann_team = Object.keys(announcement_teamSpecific_param2);
	for (const e in a_ep_ann_team) {
		body.push(`<tr><td>announcements</td><td>announcements/team_specific/team1/${a_ep_ann_team[e]}</td></tr>`);
		body.push(`<tr><td>announcements</td><td>announcements/team_specific/team1/${a_ep_ann_team[e]}/top</td></tr>`);
	}
	for (const e in a_ep_ann_team) {
		body.push(`<tr><td>announcements</td><td>announcements/team_specific/team2/${a_ep_ann_team[e]}</td></tr>`);
		body.push(`<tr><td>announcements</td><td>announcements/team_specific/team2/${a_ep_ann_team[e]}/top</td></tr>`);
	}

	// insert remove announcement endpoints
	body.push("<tr><td>announcements</td><td>announcements/remove/global</td></tr>");
	body.push("<tr><td>announcements</td><td>announcements/remove/global/all</td></tr>");
	body.push("<tr><td>announcements</td><td>announcements/remove/global/bottom</td></tr>");
	body.push("<tr><td>announcements</td><td>announcements/remove/team1</td></tr>");
	body.push("<tr><td>announcements</td><td>announcements/remove/team1/all</td></tr>");
	body.push("<tr><td>announcements</td><td>announcements/remove/team1/bottom</td></tr>");
	body.push("<tr><td>announcements</td><td>announcements/remove/team2</td></tr>");
	body.push("<tr><td>announcements</td><td>announcements/remove/team2/all</td></tr>");
	body.push("<tr><td>announcements</td><td>announcements/remove/team2/bottom</td></tr>");

	// insert the link to this documentation
	body.push("<tr><td>docs</td><td>docs</td></tr>");

	// insert changing scores endpoint
	const a_ep_score = Object.keys(endpointsScore);
	for (const e in a_ep_score) {
		body.push(`<tr><td>score</td><td>score/${a_ep_score[e]}/team1/<b>__NUMBER__</b></td></tr>`);
		body.push(`<tr><td>score</td><td>score/${a_ep_score[e]}/team2/<b>__NUMBER__</b></td></tr>`);
	}

	// insert the available toggle endpoints
	const a_ep_toggle = Object.keys(endpointsToggle);
	for (const e in a_ep_toggle) {
		body.push(`<tr><td>toggle</td><td>toggle/${a_ep_toggle[e]}</td></tr>`);
		body.push(`<tr><td>toggle</td><td>toggle/${a_ep_toggle[e]}/false</td></tr>`);
		body.push(`<tr><td>toggle</td><td>toggle/${a_ep_toggle[e]}/true</td></tr>`);
	}
	body.push("<tr><td>toggle</td><td>toggle/force-reload</td></tr>");

	// end of table and insert the JS to enhance the page on load
	body.push("</tbody></table>");
	body.push(`<script type="text/javascript">
const API_KEY = window.location.pathname.split("/")[3];
const HOST = window.location.protocol + "//" + window.location.host;
const BASE_PATH = "/glimpse-graphics-api/v1/";

window.addEventListener("load", (e) => {
	document.getElementsByTagName("tbody")[0].childNodes.forEach(e => {
        if (e.childNodes[1].textContent !== "__URL__") {
			const a = document.createElement("a");
			a.href = HOST + BASE_PATH + API_KEY + "/" + e.lastChild.textContent;
			a.text = e.lastChild.textContent;

			const td_bit = document.createElement("td");
            td_bit.title = "Click to copy Bitfocus Companion link to clipboard.";
			td_bit.textContent = "Bitfocus Companion Link";
			td_bit.onclick = (e) => {
				navigator.clipboard.writeText(HOST + BASE_PATH +
					"$(internal:custom_GLIMPSE_GFX_API_KEY)/" + e.target.parentElement.childNodes[1].textContent);
			};
			td_bit.classList.add("bit-link");

			const td_url = document.createElement("td");
			td_url.title = "Click to test in browser.";
			td_url.appendChild(a);
			td_url.onclick = (e) => { window.location.href = e.target.childNodes[0].href; };
			e.removeChild(e.lastChild);
			e.appendChild(td_url);
			e.appendChild(td_bit);
        }
	});
});
</script>`);
	body.push("")
	body.push("</body></html>");

	// save static file to disk
	try {
		const directory = path.join(__dirname, '..', '_static');
		const filePath = path.join(directory, "_docs.html");
		await fs.ensureFile(filePath);
		await fs.writeFile(filePath, body.join(""));
	} catch (e) {
		console.error("Failed to generate _docs.html")
		console.error(e);
	}
}
