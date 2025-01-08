import { replicants } from "../util/replicants";
import {XMLParser} from "fast-xml-parser";

const options = {
	ignoreAttributes: false,
	attributeNamePrefix : "",
	attributesGroupName : ""
};

const parser = new XMLParser(options);

setInterval(async () => {
	const response = await fetch(replicants.http.sidearms.url.value).then((res) => res.text()).catch(() => "");
	replicants.http.sidearms.body.value = parser.parse(response);
}, 1000);
