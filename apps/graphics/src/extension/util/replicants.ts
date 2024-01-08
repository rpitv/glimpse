import {get as nodecg} from './nodecg';
import {Announcement} from "./Announcement";

export const replicants = {
	sync: {
		availablePorts: nodecg().Replicant<string[]>("availablePorts", "glimpse-graphics.sync-settings", {defaultValue: [], persistent: false}),
		selectedPort: nodecg().Replicant<string|null>("selectedPort", "glimpse-graphics.sync-settings", {defaultValue: null}),
		selectedSport: nodecg().Replicant<string>("selectedSport", "glimpse-graphics.sync-settings", {defaultValue: 'Hockey/Lacrosse'}),
		status: nodecg().Replicant<{ connected: boolean, bitrate: number, error: boolean, errorMsg: string }>("status", "glimpse-graphics.sync-settings", {
			defaultValue: {
				connected: false,
				bitrate: 0,
				error: false,
				errorMsg: "Error"
			}, persistent: false
		}),
		values: {
			clock: nodecg().Replicant<boolean>("clock", "glimpse-graphics.sync-settings.values", {defaultValue: false}),
			period: nodecg().Replicant<boolean>("period", "glimpse-graphics.sync-settings.values", {defaultValue: false}),
			teams: [
				{
					score: nodecg().Replicant<boolean>("score", "glimpse-graphics.sync-settings.values.team1", {defaultValue: false}),
					name: nodecg().Replicant<boolean>("name", "glimpse-graphics.sync-settings.values.team1", {defaultValue: false}),
					abbreviation: nodecg().Replicant<boolean>("abbreviation", "glimpse-graphics.sync-settings.values.team1", {defaultValue: false}),
					shots: nodecg().Replicant<boolean>("shots", "glimpse-graphics.sync-settings.values.team1", {defaultValue: false}),
					timeouts: nodecg().Replicant<boolean>("timeouts", "glimpse-graphics.sync-settings.values.team1", {defaultValue: false}),
				},{
					score: nodecg().Replicant<boolean>("score", "glimpse-graphics.sync-settings.values.team2", {defaultValue: false}),
					name: nodecg().Replicant<boolean>("name", "glimpse-graphics.sync-settings.values.team2", {defaultValue: false}),
					abbreviation: nodecg().Replicant<boolean>("abbreviation", "glimpse-graphics.sync-settings.values.team2", {defaultValue: false}),
					shots: nodecg().Replicant<boolean>("shots", "glimpse-graphics.sync-settings.values.team2", {defaultValue: false}),
					timeouts: nodecg().Replicant<boolean>("timeouts", "glimpse-graphics.sync-settings.values.team2", {defaultValue: false}),
				}
			],
			baseball: {
				bottomTop: nodecg().Replicant<boolean>("bottomTop", "glimpse-graphics.sync-settings.values.baseball", {defaultValue: false}),
				outsStrikesBalls: nodecg().Replicant<boolean>("outsStrikesBall", "glimpse-graphics.sync-settings.values.baseball", {defaultValue: false}),
			},
			football: {
				playClock: nodecg().Replicant<boolean>("playClock", "glimpse-graphics.sync-settings.values.football", {defaultValue: false}),
				downs:  nodecg().Replicant<boolean>("downs", "glimpse-graphics.sync-settings.values.football", {defaultValue: false}),
				yardsToGo:  nodecg().Replicant<boolean>("yardsToGo", "glimpse-graphics.sync-settings.values.football", {defaultValue: false}),
				possession:  nodecg().Replicant<boolean>("possession", "glimpse-graphics.sync-settings.values.football", {defaultValue: false}),
			},
			sogs: nodecg().Replicant<boolean>("sogs", "glimpse-graphics.sync-settings.values", {defaultValue: false})
		}
	},
	gameSettings: {
		api: {
			enabled: nodecg().Replicant<boolean>("enabled", "glimpse-graphics.game-settings.api", {defaultValue: false}),
			key: nodecg().Replicant<string>("key", `glimpse-graphics.game-settings.api`, {defaultValue: 'CHANGE_ME_API_KEY'}),
			forceReload: nodecg().Replicant<boolean>("forceReload", "glimpse-graphics.game-settings.api", {defaultValue: false}),
		},
		style: nodecg().Replicant<'espn'|'rpitv-modern'|'rpitv-classic' | 'football'>('style', "glimpse-graphics.game-settings.style", {defaultValue: 'rpitv-modern'}),
		clock: {
			enabled: nodecg().Replicant<boolean>("enabled", "glimpse-graphics.game-settings.clock", {defaultValue: true}),
		},
		periods: {
			enabled: nodecg().Replicant<boolean>("enabled", "glimpse-graphics.game-settings.periods", {defaultValue: true}),
			count: nodecg().Replicant<number>('count', 'glimpse-graphics.game-settings.periods', {defaultValue: 3}),
			length: nodecg().Replicant<number>('length', 'glimpse-graphics.game-settings.periods', {defaultValue: 1200_000}),
			overtime: {
				enabled: nodecg().Replicant<boolean>('enabled', 'glimpse-graphics.game-settings.periods.overtime', {defaultValue: false}),
				count: nodecg().Replicant<number>('count', 'glimpse-graphics.game-settings.periods.overtime', {defaultValue: 0}),
				length: nodecg().Replicant<number>('length', 'glimpse-graphics.game-settings.periods.overtime', {defaultValue: 300_000}),
			},
			shootouts: nodecg().Replicant<boolean>('shootouts', 'glimpse-graphics.game-settings.periods', {defaultValue: false}),
		},
		baseball: {
			bases: nodecg().Replicant<boolean>("bases", "glimpse-graphics.game-settings.baseball", {defaultValue: false}),
			bottomTop: nodecg().Replicant<boolean>("bottomTop", "glimpse-graphics.game-settings.baseball", {defaultValue: false}),
			outsStrikesBalls: nodecg().Replicant<boolean>("outsStrikesBalls", "glimpse-graphics.game-settings.baseball", {defaultValue: false}),
		},
		football: {
			downs: nodecg().Replicant<boolean>("downs", "glimpse-graphics.game-settings.football", {defaultValue: false}),
			possession: nodecg().Replicant<boolean>("possession", "glimpse-graphics.game-settings.football", {defaultValue: false}),
			yardsToGo: nodecg().Replicant<boolean>("yardsToGo", "glimpse-graphics.game-settings.football", {defaultValue: false}),
			playClock: nodecg().Replicant<boolean>("playClock", "glimpse-graphics.game-settings.football", {defaultValue: false}),
		}
	},
	scoreboard: {
		visible: nodecg().Replicant<boolean>('visible', 'glimpse-graphics.scoreboard', {defaultValue: true}),
		clock: {
			time: nodecg().Replicant<number>('time', 'glimpse-graphics.scoreboard.clock', {defaultValue: 1200_000}),
			isRunning: nodecg().Replicant<boolean>('isRunning', 'glimpse-graphics.scoreboard.clock', {defaultValue: false, persistent: false}),
		},
		period: nodecg().Replicant<number>('period', 'glimpse-graphics.scoreboard', {defaultValue: 1}),
		playClock: nodecg().Replicant<number>('playClock', 'glimpse-graphics.playClock', {defaultValue: 0}),
		down: nodecg().Replicant<number>('down', 'glimpse-graphics.down', {defaultValue: 1}),
		yardsToGo: nodecg().Replicant<string>('yardsToGo', 'glimpse-graphics.yardsToGo', {defaultValue: ""}),
		possession: nodecg().Replicant<string>('possession', 'glimpse-graphics.possession', {defaultValue: ''}),
		penalty:  nodecg().Replicant<boolean>("penalty", "glimpse-graphics.penalty", {defaultValue: true}),

	},
	teams: [
		{
			enabled: nodecg().Replicant<boolean>("enabled", `glimpse-graphics.game-settings.team0`, {defaultValue: true}),
			score: nodecg().Replicant<number>("score", `glimpse-graphics.scoreboard.team0`, {defaultValue: 0}),
			name: nodecg().Replicant<string>("name", `glimpse-graphics.game-settings.team0`, {defaultValue: "Team 1"}),
			abbreviation: nodecg().Replicant<string>("abbreviation", `glimpse-graphics.game-settings.team0`, {defaultValue: "ONE"}),
			primaryColor: nodecg().Replicant<string>("primaryColor", `glimpse-graphics.game-settings.team0`, {defaultValue: '#ffffff'}),
			secondaryColor: nodecg().Replicant<string>("secondaryColor", `glimpse-graphics.game-settings.team0`, {defaultValue: '#aaaaaa'}),
			scoreboardPrimaryColor: nodecg().Replicant<string>("scoreboardPrimaryColor", `glimpse-graphics.game-settings.team0`, {defaultValue: '#ffffff'}),
			scoreboardSecondaryColor: nodecg().Replicant<string>("scoreboardSecondaryColor", `glimpse-graphics.game-settings.team0`, {defaultValue: '#aaaaaa'}),
			logo: nodecg().Replicant<string>("logo", `glimpse-graphics.game-settings.team0`, {defaultValue: ''}),
			schoolName: nodecg().Replicant<string>("schoolName", `glimpse-graphics.game-settings.team0`, {defaultValue: 'School One'}),
			shots: nodecg().Replicant<number>("shots", `glimpse-graphics.game-settings.team0`, {defaultValue: 0}),
			player1PenaltyNumber: nodecg().Replicant<string>("player1PenaltyNumber", `glimpse-graphics.game-settings.team0`, {defaultValue: ""}),
			player1PenaltyClock: nodecg().Replicant<string>("player1PenaltyClock", `glimpse-graphics.game-settings.team0`, {defaultValue: ""}),
			player2PenaltyNumber: nodecg().Replicant<string>("player2PenaltyNumber", `glimpse-graphics.game-settings.team0`, {defaultValue: ""}),
			player2PenaltyClock: nodecg().Replicant<string>("player2PenaltyClock", `glimpse-graphics.game-settings.team0`, {defaultValue: ""}),
			timeouts: nodecg().Replicant<number>("timeouts", `glimpse-graphics.game-settings.team0`, {defaultValue: 0}),
			shootouts: nodecg().Replicant<string>("shootouts", `glimpse-graphics.game-settings.team0`, {defaultValue: ""})

		},
		{
			enabled: nodecg().Replicant<boolean>("enabled", `glimpse-graphics.game-settings.team1`, {defaultValue: true}),
			score: nodecg().Replicant<number>("score", `glimpse-graphics.scoreboard.team1`, {defaultValue: 0}),
			name: nodecg().Replicant<string>("name", `glimpse-graphics.game-settings.team1`, {defaultValue: "Team 2"}),
			abbreviation: nodecg().Replicant<string>("abbreviation", `glimpse-graphics.game-settings.team1`, {defaultValue: "TWO"}),
			primaryColor: nodecg().Replicant<string>("primaryColor", `glimpse-graphics.game-settings.team1`, {defaultValue: '#ffffff'}),
			secondaryColor: nodecg().Replicant<string>("secondaryColor", `glimpse-graphics.game-settings.team1`, {defaultValue: '#aaaaaa'}),
			scoreboardPrimaryColor: nodecg().Replicant<string>("scoreboardPrimaryColor", `glimpse-graphics.game-settings.team1`, {defaultValue: '#ffffff'}),
			scoreboardSecondaryColor: nodecg().Replicant<string>("scoreboardSecondaryColor", `glimpse-graphics.game-settings.team1`, {defaultValue: '#aaaaaa'}),
			logo: nodecg().Replicant<string>("logo", `glimpse-graphics.game-settings.team1`, {defaultValue: ''}),
			schoolName: nodecg().Replicant<string>("schoolName", `glimpse-graphics.game-settings.team1`, {defaultValue: 'School Two'}),
			shots: nodecg().Replicant<number>("shots", `glimpse-graphics.game-settings.team1`, {defaultValue: 0}),
			player1PenaltyNumber: nodecg().Replicant<string>("player1PenaltyNumber", `glimpse-graphics.game-settings.team1`, {defaultValue: ""}),
			player1PenaltyClock: nodecg().Replicant<string>("player1PenaltyClock", `glimpse-graphics.game-settings.team1`, {defaultValue: ""}),
			player2PenaltyNumber: nodecg().Replicant<string>("player2PenaltyNumber", `glimpse-graphics.game-settings.team1`, {defaultValue: ""}),
			player2PenaltyClock: nodecg().Replicant<string>("player2PenaltyClock", `glimpse-graphics.game-settings.team1`, {defaultValue: ""}),
			timeouts: nodecg().Replicant<number>("timeouts", `glimpse-graphics.game-settings.team1`, {defaultValue: 0}),
			shootouts: nodecg().Replicant<string>("shootouts", `glimpse-graphics.game-settings.team1`, {defaultValue: ""})
		}
	],
	announcements: {
		global: nodecg().Replicant<Announcement[]>("global", `glimpse-graphics.game-settings.announcements`, {defaultValue: []}),
		team1: nodecg().Replicant<Announcement[]>("team1", `glimpse-graphics.game-settings.announcements`, {defaultValue: []}),
		team2: nodecg().Replicant<Announcement[]>("team2", `glimpse-graphics.game-settings.announcements`, {defaultValue: []}),
	},
	lowerThird: {
		school1Logo: nodecg().Replicant<string>("school1Logo", `glimpse-graphics.images.lowerThird`, {defaultValue: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/RPI_Engineers.svg/1200px-RPI_Engineers.svg.png"}),
		school2Logo: nodecg().Replicant<string>("school2Logo", `glimpse-graphics.images.lowerThird`, {defaultValue: ""}),
		scoreboard: nodecg().Replicant<boolean>("scoreboard", `glimpse-graphics.images.lowerThird`, {defaultValue: false}),
		locator: nodecg().Replicant<boolean>("locator", `glimpse-graphics.images.lowerThird`, {defaultValue: false}),
		commentators: {
			show: nodecg().Replicant<boolean>("show", `glimpse-graphics.images.lowerThird`, {defaultValue: false}),
			leftPerson: nodecg().Replicant<string>("leftPerson", `glimpse-graphics.images.lowerThird`, {defaultValue: "Dan Fridgen"}),
			centerPerson: nodecg().Replicant<string>("centerPerson", `glimpse-graphics.images.lowerThird`, {defaultValue: "Dan"}),
			rightPerson: nodecg().Replicant<string>("rightPerson", `glimpse-graphics.images.lowerThird`, {defaultValue: "Dan Bahl"}),
			offset: {
				enabled: nodecg().Replicant<boolean>("enabled", `glimpse-graphics.images.lowerThird`, {defaultValue: false}),
				number: nodecg().Replicant<number>("number", `glimpse-graphics.images.lowerThird`, {defaultValue: 36})
			}
		},
		endGraphics: {
			disabled: nodecg().Replicant<boolean>("disabled", `glimpse-graphics.images.endGraphics`, {defaultValue: false}),
			show: nodecg().Replicant<boolean>("show", `glimpse-graphics.images.endGraphics`, {defaultValue: false}),
			title: nodecg().Replicant<string>("title", `glimpse-graphics.images.endGraphics`, {defaultValue: "RPI TV Crew"}),
			message: nodecg().Replicant<string>("message", `glimpse-graphics.images.endGraphics`, {defaultValue: "Director\nProducer\nReplay Operator\nCamera Operator"}),
			length: nodecg().Replicant<number>('length', 'glimpse-graphics.endGraphics', {defaultValue: 30}),
			type: nodecg().Replicant<'scroll' | 'box'>("type", `glimpse-graphics.images.endGraphics`, {defaultValue: 'box'})
		},
		bug: nodecg().Replicant<boolean>("bug", `glimpse-graphics.images.lowerThird`, {defaultValue: true}),
		showCopyright: nodecg().Replicant<boolean>("showCopyright", `glimpse-graphics.images.lowerThird`, {defaultValue: false}),
	},
	slideshow: {
		enabled: nodecg().Replicant<boolean>("enabled", `glimpse-graphics.images.slideshow`, {defaultValue: false}),
		interval: nodecg().Replicant<number>("interval", `glimpse-graphics.images.slideshow`, {defaultValue: 5})
	}
}
