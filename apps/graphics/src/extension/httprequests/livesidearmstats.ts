import { replicants } from "../util/replicants";
import {XMLParser} from "fast-xml-parser";

const options = {
	ignoreAttributes: false,
	attributeNamePrefix : "",
	attributesGroupName : ""
};

const parser = new XMLParser(options);
const sidearms = replicants.http.sidearms;

setInterval(async () => {
	const response = await fetch(sidearms.url.value);
	sidearms.body.value = parser.parse(await response.text());
}, 1000);
