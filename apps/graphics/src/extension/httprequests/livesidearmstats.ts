import { replicants } from "../util/replicants";

export async function getStats(url: string) {
	const response = await fetch(url);
	replicants.http.sidearms.url.value = await response.text();
}

getStats("https://rpiathletics.com/services/cumestats.ashx/games?global_sport_shortname=mhockey");
