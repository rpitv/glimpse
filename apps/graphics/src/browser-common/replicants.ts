import {replicant} from "./replicant";
import {Announcement} from "../common/Announcement";

export async function loadReplicants() {
	return {
		sync: {
			availablePorts: await replicant<string[]>("availablePorts", "glimpse-graphics.sync-settings", {
				defaultValue: [],
				persistent: false
			}),
			selectedPort: await replicant<string | null>("selectedPort", "glimpse-graphics.sync-settings", {defaultValue: null}),
			selectedSport: await replicant<string>("selectedSport", "glimpse-graphics.sync-settings", {defaultValue: 'Hockey/Lacrosse'}),
			status: await replicant<{ connected: boolean, bitrate: number, error: boolean, errorMsg: string }>("status", "glimpse-graphics.sync-settings", {
				defaultValue: {
					connected: false,
					bitrate: 0,
					error: false,
					errorMsg: "Error"
				}, persistent: false
			}),
			values: {
				clock: await replicant<boolean>("clock", "glimpse-graphics.sync-settings.values", {defaultValue: false}),
				period: await replicant<boolean>("period", "glimpse-graphics.sync-settings.values", {defaultValue: false}),
				teams: [
					{
						score: await replicant<boolean>("score", "glimpse-graphics.sync-settings.values.team1", {defaultValue: false}),
						name: await replicant<boolean>("name", "glimpse-graphics.sync-settings.values.team1", {defaultValue: false}),
						abbreviation: await replicant<boolean>("abbreviation", "glimpse-graphics.sync-settings.values.team1", {defaultValue: false}),
					}, {
						score: await replicant<boolean>("score", "glimpse-graphics.sync-settings.values.team2", {defaultValue: false}),
						name: await replicant<boolean>("name", "glimpse-graphics.sync-settings.values.team2", {defaultValue: false}),
						abbreviation: await replicant<boolean>("abbreviation", "glimpse-graphics.sync-settings.values.team2", {defaultValue: false}),
					}
				],
				baseball: {
					bottomTop: await replicant<boolean>("bottomTop", "glimpse-graphics.sync-settings.values.baseball", {defaultValue: false}),
					outsStrikesBalls: await replicant<boolean>("outsStrikesBall", "glimpse-graphics.sync-settings.values.baseball", {defaultValue: false}),
				},
				football: {
					downs: await replicant<boolean>("downs", "glimpse-graphics.sync-settings.values.football", {defaultValue: false}),
					possession: await replicant<boolean>("possession", "glimpse-graphics.sync-settings.values.football", {defaultValue: false}),
					yardsToGo: await replicant<boolean>("yardsToGo", "glimpse-graphics.sync-settings.values.football", {defaultValue: false}),
					playClock: await replicant<boolean>("playClock", "glimpse-graphics.sync-settings.values.football", {defaultValue: false}),
				}
			}
		},
		gameSettings: {
			style: await replicant<'espn' | 'rpitv-modern' | 'rpitv-classic'>('style', 'glimpse-graphics.game-settings.style', {defaultValue: 'rpitv-modern'}),
			clock: {
				enabled: await replicant<boolean>("enabled", "glimpse-graphics.game-settings.clock", {defaultValue: true}),
			},
			periods: {
				enabled: await replicant<boolean>("enabled", "glimpse-graphics.game-settings.periods", {defaultValue: true}),
				count: await replicant<number>('count', 'glimpse-graphics.game-settings.periods', {defaultValue: 3}),
				length: await replicant<number>('length', 'glimpse-graphics.game-settings.periods', {defaultValue: 1200_000}),
				overtime: {
					count: await replicant<number>('count', 'glimpse-graphics.game-settings.periods.overtime', {defaultValue: 0}),
					isInfinite: await replicant<boolean>('isInfinite', 'glimpse-graphics.game-settings.periods.overtime', {defaultValue: false}),
					length: await replicant<number>('length', 'glimpse-graphics.game-settings.periods.overtime', {defaultValue: 300_000}),
				},
				shootouts: await replicant<boolean>('shootouts', 'glimpse-graphics.game-settings.periods', {defaultValue: false}),
			},

			baseball: {
				bases: await replicant<boolean>("bases", "glimpse-graphics.game-settings.baseball", {defaultValue: false}),
				bottomTop: await replicant<boolean>("bottomTop", "glimpse-graphics.game-settings.baseball", {defaultValue: false}),
				outsStrikesBalls: await replicant<boolean>("outsStrikesBalls", "glimpse-graphics.game-settings.baseball", {defaultValue: false}),
			},
			football: {
				downs: await replicant<boolean>("downs", "glimpse-graphics.game-settings.football", {defaultValue: false}),
				possession: await replicant<boolean>("possession", "glimpse-graphics.game-settings.football", {defaultValue: false}),
				yardsToGo: await replicant<boolean>("yardsToGo", "glimpse-graphics.game-settings.football", {defaultValue: false}),
				playClock: await replicant<boolean>("playClock", "glimpse-graphics.game-settings.football", {defaultValue: false}),
			}
		},
		scoreboard: {
			visible: await replicant<boolean>('visible', 'glimpse-graphics.scoreboard', {defaultValue: true}),
			clock: {
				time: await replicant<number>('time', 'glimpse-graphics.scoreboard.clock', {defaultValue: 1200_000}),
				isRunning: await replicant<boolean>('isRunning', 'glimpse-graphics.scoreboard.clock', {
					defaultValue: false,
					persistent: false
				}),
			},
			period: await replicant<number>('period', 'glimpse-graphics.scoreboard', {defaultValue: 1})
		},
		teams: [
			{
				enabled: await replicant<boolean>("enabled", `glimpse-graphics.game-settings.team0`, {defaultValue: true}),
				score: await replicant<number>("score", `glimpse-graphics.scoreboard.team0`, {defaultValue: 0}),
				name: await replicant<string>("name", `glimpse-graphics.game-settings.team0`, {defaultValue: "Team 1"}),
				abbreviation: await replicant<string>("abbreviation", `glimpse-graphics.game-settings.team0`, {defaultValue: "ONE"}),
				primaryColor: await replicant<string>("primaryColor", `glimpse-graphics.game-settings.team0`, {defaultValue: '#ffffff'}),
				secondaryColor: await replicant<string>("secondaryColor", `glimpse-graphics.game-settings.team0`, {defaultValue: '#aaaaaa'}),
				logo: await replicant<string>("logo", `glimpse-graphics.game-settings.team0`, {defaultValue: ''}),
				schoolName: await replicant<string>("schoolName", `glimpse-graphics.game-settings.team0`, {defaultValue: 'School One'}),
				shots: await replicant<number>("shots", `glimpse-graphics.game-settings.team0`, {defaultValue: 0}),
			},
			{
				enabled: await replicant<boolean>("enabled", `glimpse-graphics.game-settings.team1`, {defaultValue: true}),
				score: await replicant<number>("score", `glimpse-graphics.scoreboard.team1`, {defaultValue: 0}),
				name: await replicant<string>("name", `glimpse-graphics.game-settings.team1`, {defaultValue: "Team 2"}),
				abbreviation: await replicant<string>("abbreviation", `glimpse-graphics.game-settings.team1`, {defaultValue: "TWO"}),
				primaryColor: await replicant<string>("primaryColor", `glimpse-graphics.game-settings.team1`, {defaultValue: '#ffffff'}),
				secondaryColor: await replicant<string>("secondaryColor", `glimpse-graphics.game-settings.team1`, {defaultValue: '#aaaaaa'}),
				logo: await replicant<string>("logo", `glimpse-graphics.game-settings.team1`, {defaultValue: ''}),
				schoolName: await replicant<string>("schoolName", `glimpse-graphics.game-settings.team1`, {defaultValue: 'School Two'}),
				shots: await replicant<number>("shots", `glimpse-graphics.game-settings.team1`, {defaultValue: 0}),
			}
		],
		announcements: {
			global: await replicant<Announcement[]>("global", `glimpse-graphics.game-settings.announcements`, {defaultValue: []}),
			team1: await replicant<Announcement[]>("team1", `glimpse-graphics.game-settings.announcements`, {defaultValue: []}),
			team2: await replicant<Announcement[]>("team2", `glimpse-graphics.game-settings.announcements`, {defaultValue: []}),
		},
		lowerThird: {
			school1Logo: await replicant<string>("school1Logo", `glimpse-graphics.images.lowerThird`, {defaultValue: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/RPI_Engineers.svg/1200px-RPI_Engineers.svg.png"}),
			school2Logo: await replicant<string>("school2Logo", `glimpse-graphics.images.lowerThird`, {defaultValue: ""}),
			scoreboard: await replicant<boolean>("scoreboard", `glimpse-graphics.images.lowerThird`, {defaultValue: false}),
			locator: await replicant<boolean>("locator", `glimpse-graphics.images.lowerThird`, {defaultValue: false}),
			commentators: {
				show: await replicant<boolean>("show", `glimpse-graphics.images.lowerThird`, {defaultValue: false}),
				leftPerson: await replicant<string>("leftPerson", `glimpse-graphics.images.lowerThird`, {defaultValue: "Dan Bahl"}),
				rightPerson: await replicant<string>("rightPerson", `glimpse-graphics.images.lowerThird`, {defaultValue: "Dan Fridgen"}),
				offset: {
					enabled: await replicant<boolean>("enabled", `glimpse-graphics.images.lowerThird`, {defaultValue: false}),
					number: await replicant<number>("number", `glimpse-graphics.images.lowerThird`, {defaultValue: 0})
				}
			},
			endGraphics: {
				disabled: await replicant<boolean>("disabled", `glimpse-graphics.images.endGraphics`, {defaultValue: false}),
				show: await replicant<boolean>("endGraphics", `glimpse-graphics.images.endGraphics`, {defaultValue: false}),
				title: await replicant<string>("title", `glimpse-graphics.images.endGraphics`, {defaultValue: "RPI TV Crew"}),
				message: await replicant<string>("message", `glimpse-graphics.images.endGraphics`, {defaultValue: "Director\nProducer\nReplay Operator\nCamera Operator"}),
				length: await replicant<number>('length', 'glimpse-graphics.endGraphics', {defaultValue: 30})
			},
			bug: await replicant<boolean>("bug", `glimpse-graphics.images.lowerThird`, {defaultValue: true}),
		}
	}
}