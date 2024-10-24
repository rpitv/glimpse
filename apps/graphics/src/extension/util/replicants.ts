import {get as nodecg} from './nodecg';
import { Credit } from "./Credit";
import {Announcement} from "./Announcement";

export const replicants = {
	sync: {
		availablePorts: nodecg().Replicant<string[]>("availablePorts", "glimpse-graphics.sync-settings", {
			defaultValue: [],
			persistent: false
		}),
		selectedPort: nodecg().Replicant<string | null>("selectedPort", "glimpse-graphics.sync-settings", {defaultValue: null}),
		selectedSport: nodecg().Replicant<string>("selectedSport", "glimpse-graphics.sync-settings", {defaultValue: 'Hockey/Lacrosse'}),
		status: nodecg().Replicant<{ connected: boolean, bitrate: number, error: boolean, errorMsg: string }>("status", "glimpse-graphics.sync-settings", {
			defaultValue: {
				connected: false,
				bitrate: 0,
				error: false,
				errorMsg: "Error"
			}, persistent: false
		}),
		daktronicsFeed: nodecg().Replicant<"tv" | "rtd" | "">("daktronicsFeed", "glimpse-graphics.sync-settings", {defaultValue: ""}),
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
				}, {
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
				downs: nodecg().Replicant<boolean>("downs", "glimpse-graphics.sync-settings.values.football", {defaultValue: false}),
				possession: nodecg().Replicant<boolean>("possession", "glimpse-graphics.sync-settings.values.football", {defaultValue: false}),
				yardsToGo: nodecg().Replicant<boolean>("yardsToGo", "glimpse-graphics.sync-settings.values.football", {defaultValue: false}),
				playClock: nodecg().Replicant<boolean>("playClock", "glimpse-graphics.sync-settings.values.football", {defaultValue: false}),
			},
			sogs: nodecg().Replicant<boolean>("sogs", "glimpse-graphics.sync-settings.values", {defaultValue: false}),
			faceoffs: nodecg().Replicant<boolean>("faceoffs", "glimpse-graphics.sync-settings.values", {defaultValue: false})
		}
	},
	gameSettings: {
		api: {
			enabled: nodecg().Replicant<boolean>("enabled", "glimpse-graphics.game-settings.api", {defaultValue: false}),
			key: nodecg().Replicant<string>("key", `glimpse-graphics.game-settings.api`, {defaultValue: 'CHANGE_ME_API_KEY'}),
			forceReload: nodecg().Replicant<boolean>("forceReload", "glimpse-graphics.game-settings.api", {defaultValue: false}),
		},
		style: nodecg().Replicant<'espn' | 'rpitv' | 'football'>('style', 'glimpse-graphics.game-settings.style', {defaultValue: 'rpitv'}),
		clock: {
			enabled: nodecg().Replicant<boolean>("enabled", "glimpse-graphics.game-settings.clock", {defaultValue: true}),
		},
		periods: {
			enabled: nodecg().Replicant<boolean>("enabled", "glimpse-graphics.game-settings.periods", {defaultValue: true}),
			count: nodecg().Replicant<number>('count', 'glimpse-graphics.game-settings.periods', {defaultValue: 3}),
			length: nodecg().Replicant<number>('length', 'glimpse-graphics.game-settings.periods', {defaultValue: 1200_000}),
			overtime: {
				count: nodecg().Replicant<number>('count', 'glimpse-graphics.game-settings.periods.overtime', {defaultValue: 0}),
				isInfinite: nodecg().Replicant<boolean>('isInfinite', 'glimpse-graphics.game-settings.periods.overtime', {defaultValue: false}),
				length: nodecg().Replicant<number>('length', 'glimpse-graphics.game-settings.periods.overtime', {defaultValue: 300_000}),
			},
			shootouts: nodecg().Replicant<boolean>('shootouts', 'glimpse-graphics.game-settings.periods', {defaultValue: false}),
		},
		showShootouts: nodecg().Replicant<boolean>("showShootouts", 'glimpse-graphics.game-settings',{defaultValue: false}),
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
			isRunning: nodecg().Replicant<boolean>('isRunning', 'glimpse-graphics.scoreboard.clock', {
				defaultValue: false,
				persistent: false
			}),
		},
		period: nodecg().Replicant<number>('period', 'glimpse-graphics.scoreboard', {defaultValue: 1}),
		playClock: nodecg().Replicant<number>('playClock', 'glimpse-graphics.playClock', {defaultValue: 0}),
		down: nodecg().Replicant<number>('down', 'glimpse-graphics.down', {defaultValue: 1}),
		yardsToGo: nodecg().Replicant<string>('yardsToGo', 'glimpse-graphics.yardsToGo', {defaultValue: ""}),
		possession: nodecg().Replicant<string>('possession', 'glimpse-graphics.possession', {defaultValue: ''}),
		penalty: nodecg().Replicant<boolean>("penalty", "glimpse-graphics.penalty", {defaultValue: true}),
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
	fullscreen: {
		credits: {
			credit: nodecg().Replicant<Credit[]>("credit", `glimpse-graphics.graphics.fullscreen.credits`, {defaultValue: []}),
			show: nodecg().Replicant<boolean>("show", `glimpse-graphics.graphics.fullscreen.credits`, {defaultValue: false}),
		}
	},
	lowerThird: {
		bug: {
			show: nodecg().Replicant<boolean>("show", `glimpse-graphics.graphics.lowerThird.bug`, {defaultValue: true}),
			offsetX: nodecg().Replicant<number>("offsetX", `glimpse-graphics.graphics.lowerThird.bug`, {defaultValue: 0}),
			offsetY: nodecg().Replicant<number>("offsetY", `glimpse-graphics.graphics.lowerThird.bug`, {defaultValue: 0}),
		},
		commentators: {
			leftPerson: {
				name: nodecg().Replicant<string>("name", `glimpse-graphics.graphics.lowerThird.commentators.leftPerson`, {defaultValue: "Dan Fridgen"}),
				nameColor: nodecg().Replicant<string>("nameColor", `glimpse-graphics.graphics.lowerThird.commentators.leftPerson`, {defaultValue: "#000000"}),
				nameSize: nodecg().Replicant<number>("nameSize", `glimpse-graphics.graphics.lowerThird.commentators.leftPerson`, {defaultValue: 0}),
				description: nodecg().Replicant<string>("description", `glimpse-graphics.graphics.lowerThird.commentators.leftPerson`, {defaultValue: ""}),
				descriptionColor: nodecg().Replicant<string>("descriptionColor", `glimpse-graphics.graphics.lowerThird.commentators.leftPerson`, {defaultValue: ""}),
				descriptionSize: nodecg().Replicant<number>("descriptionSize", `glimpse-graphics.graphics.lowerThird.commentators.leftPerson`, {defaultValue: 0}),
			},
			centerPerson: {
				name: nodecg().Replicant<string>("name", `glimpse-graphics.graphics.lowerThird.commentatorsCenterPerson`, {defaultValue: ""}),
				nameColor: nodecg().Replicant<string>("nameColor", `glimpse-graphics.graphics.lowerThird.commentators.centerPerson`, {defaultValue: "#000000"}),
				nameSize: nodecg().Replicant<number>("nameSize", `glimpse-graphics.graphics.lowerThird.commentators.centerPerson`, {defaultValue: 0}),
				description: nodecg().Replicant<string>("centerDesc", `glimpse-graphics.graphics.lowerThird.commentators.centerPerson`, {defaultValue: ""}),
				descriptionColor: nodecg().Replicant<string>("descriptionColor", `glimpse-graphics.graphics.lowerThird.commentators.centerPerson`, {defaultValue: ""}),
				descriptionSize: nodecg().Replicant<number>("descriptionSize", `glimpse-graphics.graphics.lowerThird.commentators.centerPerson`, {defaultValue: 0}),
			},
			rightPerson:{
				name: nodecg().Replicant<string>("name", `glimpse-graphics.graphics.lowerThird.commentators.rightPerson`, {defaultValue: "Dan Bahl"}),
				nameColor: nodecg().Replicant<string>("nameColor", `glimpse-graphics.graphics.lowerThird.commentators.rightPerson`, {defaultValue: "#000000"}),
				nameSize: nodecg().Replicant<number>("nameSize", `glimpse-graphics.graphics.lowerThird.commentators.rightPerson`, {defaultValue: 0}),
				description: nodecg().Replicant<string>("rightDesc", `glimpse-graphics.graphics.lowerThird.commentators.rightPerson`, {defaultValue: ""}),
				descriptionColor: nodecg().Replicant<string>("descriptionColor", `glimpse-graphics.graphics.lowerThird.commentators.rightPerson`, {defaultValue: ""}),
				descriptionSize: nodecg().Replicant<number>("descriptionSize", `glimpse-graphics.graphics.lowerThird.commentators.rightPerson`, {defaultValue: 0}),
			},
			offsetY: nodecg().Replicant<number>("offsetY", `glimpse-graphics.graphics.lowerThird.commentators`, {defaultValue: 0}),
			show: nodecg().Replicant<boolean>("show", `glimpse-graphics.graphics.lowerThird.commentators`, {defaultValue: false}),
		},
		copyright: {
			show: nodecg().Replicant<boolean>("show", `glimpse-graphics.graphics.lowerThird.copyright`, {defaultValue: false}),
			offsetX: nodecg().Replicant<number>("offsetX", `glimpse-graphics.graphics.lowerThird.copyright`, {defaultValue: 0}),
			offsetY: nodecg().Replicant<number>("offsetY", `glimpse-graphics.graphics.lowerThird.copyright`, {defaultValue: 0}),
			text: nodecg().Replicant<string>("text", `glimpse-graphics.graphics.lowerThird.copyright`, {defaultValue: ""}),
			textColor: nodecg().Replicant<string>("textColor", `glimpse-graphics.graphics.lowerThird.copyright`, {defaultValue: "#000000"}),
			textSize: nodecg().Replicant<number>("textSize", `glimpse-graphics.graphics.lowerThird.copyright`, {defaultValue: 0}),
		},
		locator: {
			leftTeam: {
				name: nodecg().Replicant<string>("name", `glimpse-graphics.graphics.lowerThird.locator.leftTeam`, {defaultValue: ""}),
				nameColor: nodecg().Replicant<string>("nameColor", `glimpse-graphics.graphics.lowerThird.locator.leftTeam`, {defaultValue: "#000000"}),
				nameSize: nodecg().Replicant<number>("nanmeSize", `glimpse-graphics.graphics.lowerThird.locator.leftTeam`,{defaultValue: 0}),
				logo: nodecg().Replicant<string>("logo", `glimpse-graphics.graphics.lowerThird.locator.leftTeam`, {defaultValue: ""}),
				logoSize: nodecg().Replicant<number>("logoSize", `glimpse-graphics.graphics.lowerThird.locator.leftTeam`, {defaultValue: 100}),
				primaryColor: nodecg().Replicant<string>("primaryColor", `glimpse-graphics.graphics.lowerThird.locator.leftTeam`, {defaultValue: ""}),
				secondaryColor: nodecg().Replicant<string>("secondaryColor", `glimpse-graphics.graphics.lowerThird.locator.leftTeam`, {defaultValue: ""}),
			},
			rightTeam: {
				name: nodecg().Replicant<string>("name", `glimpse-graphics.graphics.lowerThird.locator.rightTeam`, {defaultValue: ""}),
				nameColor: nodecg().Replicant<string>("nameColor", `glimpse-graphics.graphics.lowerThird.locator.rightTeam`, {defaultValue: "#000000"}),
				nameSize: nodecg().Replicant<number>("nameSize", `glimpse-graphics.graphics.lowerThird.locator.rightTeam`,{defaultValue: 0}),
				logo: nodecg().Replicant<string>("logo", `glimpse-graphics.graphics.lowerThird.locator.rightTeam`, {defaultValue: ""}),
				logoSize: nodecg().Replicant<number>("logoSize", `glimpse-graphics.graphics.lowerThird.locator.rightTeam`, {defaultValue: 100}),
				primaryColor: nodecg().Replicant<string>("primaryColor", `glimpse-graphics.graphics.lowerThird.locator.rightTeam`, {defaultValue: ""}),
				secondaryColor: nodecg().Replicant<string>("secondaryColor", `glimpse-graphics.graphics.lowerThird.locator.rightTeam`, {defaultValue: ""}),
			},
			location: {
				name: nodecg().Replicant<string>("name", `glimpse-graphics.graphics.lowerThird.locator.location`, {defaultValue: ""}),
				nameColor: nodecg().Replicant<string>("nameColor", `glimpse-graphics.graphics.lowerThird.locator.location`, {defaultValue: ""}),
				nameSize: nodecg().Replicant<number>("nameSize", `glimpse-graphics.graphics.lowerThird.locator.location`, {defaultValue: 0}),
			},
			show: nodecg().Replicant<boolean>("show", `glimpse-grpahics.graphics.lowerThird.locator`, {defaultValue: false})
		},
		playerBio: {
			action: {
				description: nodecg().Replicant<string>("description", `glimpse-graphics.graphics.lowerThird.playerBio.action`, {defaultValue: ""}),
				fontSize: nodecg().Replicant<number>("fontSize", `glimpse-graphics.graphics.lowerThird.playerBio.action`, {defaultValue: 0}),
				player: {
					name: nodecg().Replicant<string>("name", `glimpse-graphics.graphics.lowerThird.playerBio.player`, {defaultValue: ""}),
					number: nodecg().Replicant<string>("number", `glimpse-graphics.graphics.lowerThird.playerBio.player`, {defaultValue: ""}),
					teamSide: nodecg().Replicant<"leftTeam" | "rightTeam">("teamSide", `glimpse-graphics.graphics.lowerThird.playerBio.player`, {defaultValue: "rightTeam"}),
				},
			},
			image: {
				url: nodecg().Replicant<string>("url", `glimpse-graphics.graphics.lowerThird.playerBio.image`, {defaultValue: ""}),
				backgroundColor: nodecg().Replicant<string>("backgroundColor", `glimpse-graphics.graphics.lowerThird.playerBio.image`, {defaultValue: "#000000"}),
				syncTeamColor: nodecg().Replicant<boolean>("syncTeamColor", `glimpse-graphics.graphics.lowerThird.playerBio.image`, {defaultValue: false})
			},
			offset: nodecg().Replicant<number>("offset", `glimpse-graphics.graphics.lowerThird.playerBio`, {defaultValue: 0}),
			show: nodecg().Replicant<boolean>("show", `glimpse-graphics.graphics.lowerThird.playerBio`, {defaultValue: false}),
		},
		scoreboard: {
			description: {
				fontSize: nodecg().Replicant<number>("fontSize", `glimpse-graphics.graphics.lowerThird.scoreboard.description`, {defaultValue: 0}),
				fontColor: nodecg().Replicant<string>("fontColor", `glimpse-graphics.graphics.lowerThird.scoreboard.description`, {defaultValue: "#000000"}),
				text: nodecg().Replicant<string>("text", `glimpse-graphics.graphics.lowerThird.scoreboard.description`, {defaultValue: ""}),
				timer: nodecg().Replicant<boolean>("timer", `glimpse-graphics.graphics.lowerThird.scoreboard.description`, {defaultValue: false}),
			},
			leftTeam: {
				name: nodecg().Replicant<string>("name", `glimpse-graphics.graphics.lowerThird.scoreboard.leftTeam`, {defaultValue: ""}),
				nameColor: nodecg().Replicant<string>("nameColor", `glimpse-graphics.graphics.lowerThird.scoreboard.leftTeam`, {defaultValue: "#000000"}),
				nameSize: nodecg().Replicant<number>("nameSize", `glimpse-graphics.graphics.lowerThird.scoreboard.leftTeam`,{defaultValue: 0}),
				logo: nodecg().Replicant<string>("logo", `glimpse-graphics.graphics.lowerThird.scoreboard.leftTeam`, {defaultValue: ""}),
				logoSize: nodecg().Replicant<number>("logoSize", `glimpse-graphics.graphics.lowerThird.scoreboard.leftTeam`, {defaultValue: 100}),
				primaryColor: nodecg().Replicant<string>("primaryColor", `glimpse-graphics.graphics.lowerThird.scoreboard.leftTeam`, {defaultValue: ""}),
				score: nodecg().Replicant<number>("score", `glimpse-graphics.graphics.lowerThird.scoreboard.leftTeam`, {defaultValue: 0}),
				scoreColor: nodecg().Replicant<string>("scoreColor", `glimpse-graphics.graphics.lowerThird.scoreboard.leftTeam`, {defaultValue: ""}),
				scoreSize: nodecg().Replicant<number>("scoreSize", `glimpse-graphics.graphics.lowerThird.scoreboard.leftTeam`, {defaultValue: 0}),
				secondaryColor: nodecg().Replicant<string>("secondaryColor", `glimpse-graphics.graphics.lowerThird.scoreboard.leftTeam`, {defaultValue: ""}),
			},
			rightTeam: {
				name: nodecg().Replicant<string>("name", `glimpse-graphics.graphics.lowerThird.scoreboard.rightTeam`, {defaultValue: ""}),
				nameColor: nodecg().Replicant<string>("nameColor", `glimpse-graphics.graphics.lowerThird.scoreboard.rightTeam`, {defaultValue: "#000000"}),
				nameSize: nodecg().Replicant<number>("nameSize", `glimpse-graphics.graphics.lowerThird.scoreboard.rightTeam`,{defaultValue: 0}),
				logo: nodecg().Replicant<string>("logo", `glimpse-graphics.graphics.lowerThird.scoreboard.rightTeam`, {defaultValue: ""}),
				logoSize: nodecg().Replicant<number>("logoSize", `glimpse-graphics.graphics.lowerThird.scoreboard.rightTeam`, {defaultValue: 100}),
				primaryColor: nodecg().Replicant<string>("primaryColor", `glimpse-graphics.graphics.lowerThird.scoreboard.rightTeam`, {defaultValue: ""}),
				score: nodecg().Replicant<number>("score", `glimpse-graphics.graphics.lowerThird.scoreboard.rightTeam`, {defaultValue: 0}),
				scoreColor: nodecg().Replicant<string>("scoreColor", `glimpse-graphics.graphics.lowerThird.scoreboard.rightTeam`, {defaultValue: ""}),
				scoreSize: nodecg().Replicant<number>("scoreSize", `glimpse-graphics.graphics.lowerThird.scoreboard.rightTeam`, {defaultValue: 0}),
				secondaryColor: nodecg().Replicant<string>("secondaryColor", `glimpse-graphics.graphics.lowerThird.scoreboard.rightTeam`, {defaultValue: ""}),
			},
			show: nodecg().Replicant<boolean>("show", `glimpse-graphics.graphics.lowerThird.scoreboard`, {defaultValue: false}),
		},
		endGraphics: {
			disabled: nodecg().Replicant<boolean>("disabled", `glimpse-graphics.images.endGraphics`, {defaultValue: false}),
			show: nodecg().Replicant<boolean>("show", `glimpse-graphics.images.endGraphics`, {defaultValue: false}),
			title: nodecg().Replicant<string>("title", `glimpse-graphics.images.endGraphics`, {defaultValue: "RPI TV Crew"}),
			message: nodecg().Replicant<string>("message", `glimpse-graphics.images.endGraphics`, {defaultValue: "Director\nProducer\nReplay Operator\nCamera Operator"}),
			length: nodecg().Replicant<number>('length', 'glimpse-graphics.endGraphics', {defaultValue: 30}),
			type: nodecg().Replicant<'scroll' | 'box'>("type", `glimpse-graphics.images.endGraphics`, {defaultValue: 'box'}),
		},
		showProduced: nodecg().Replicant<boolean>("showProduced", `glimpse-graphics.graphics.lowerThird`, {defaultValue: false}),
	},
	slideshow: {
		enabled: nodecg().Replicant<boolean>("enabled", `glimpse-graphics.graphics.slideshow`, {defaultValue: false}),
		interval: nodecg().Replicant<number>("interval", `glimpse-graphics.graphics.slideshow`, {defaultValue: 5})
	},
	http: {
		sidearms: {
			url: nodecg().Replicant<string>("url", `glimpse-graphics.graphics.sidearms`, {defaultValue: "https://www.sidearmstats.com/rpi/mhockey/1.xml"}),
			body: nodecg().Replicant<any>("body", `glimpse-graphics.graphics.sidearms`, {defaultValue: {}})
		},
		roster: {
			leftTeam: {
				url: nodecg().Replicant<string>("url", `glimpse-graphics.graphics.roster.leftTeam`, {defaultValue: "https://rpiathletics.com/sports/mens-ice-hockey/roster/2024-25"}),
				body: nodecg().Replicant<any>("body", `glimpse-graphics.graphics.roster.leftTeam`, {defaultValue: {}}),
				fetch: nodecg().Replicant<boolean>("fetch", `glimpse-graphics.graphics.roster.leftTeam`, {defaultValue: false}),
				jersey: nodecg().Replicant<any>("jersey", `glimpse-graphics.graphics.roster.leftTeam`, {defaultValue: {}}),
			},
			rightTeam: {
				url: nodecg().Replicant<string>("url", `glimpse-graphics.graphics.roster.rightTeam`, {defaultValue: "https://rpiathletics.com/sports/mens-ice-hockey/roster/2024-25"}),
				body: nodecg().Replicant<any>("body", `glimpse-graphics.graphics.roster.rightTeam`, {defaultValue: {}}),
				fetch: nodecg().Replicant<boolean>("fetch", `glimpse-graphics.graphics.roster.rightTeam`, {defaultValue: false}),
				jersey: nodecg().Replicant<any>("jersey", `glimpse-graphics.graphics.roster.rightTeam`, {defaultValue: {}}),
			}
		}
	}
}
