import { replicants } from "../util/replicants";

replicants.http.roster.leftTeam.fetch.on("change", async () => {
	replicants.http.roster.leftTeam.body.value = await fetch(replicants.http.roster.leftTeam.url.value, {
		"headers": {
			"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
			"accept-language": "en-US,en;q=0.9",
			"cache-control": "max-age=0",
			"priority": "u=0, i",
			"sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": "\"Windows\"",
			"sec-fetch-dest": "document",
			"sec-fetch-mode": "navigate",
			"sec-fetch-site": "same-origin",
			"sec-fetch-user": "?1",
			"upgrade-insecure-requests": "1"
		},
		"referrerPolicy": "no-referrer-when-downgrade",
		"body": null,
		"method": "GET"
	}).then((res) => res.text());
	replicants.http.roster.leftTeam.jersey.value = await fetch(`${replicants.http.roster.leftTeam.url.value}?view=2`)
		.then((res) => res.text());
});


replicants.http.roster.rightTeam.fetch.on("change", async () => {
	replicants.http.roster.rightTeam.body.value = await fetch(replicants.http.roster.rightTeam.url.value, {
		"headers": {
			"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
			"accept-language": "en-US,en;q=0.9",
			"cache-control": "max-age=0",
			"priority": "u=0, i",
			"sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": "\"Windows\"",
			"sec-fetch-dest": "document",
			"sec-fetch-mode": "navigate",
			"sec-fetch-site": "same-origin",
			"sec-fetch-user": "?1",
			"upgrade-insecure-requests": "1"
		},
		"referrerPolicy": "no-referrer-when-downgrade",
		"body": null,
		"method": "GET"
	}).then((res) => res.text());
	replicants.http.roster.rightTeam.jersey.value = await fetch(`${replicants.http.roster.rightTeam.url.value}?view=2`)
		.then((res) => res.text());
});

