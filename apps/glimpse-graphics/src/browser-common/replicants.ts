import {replicant} from "./replicant";
import {DisplayableMessage} from "../common/DisplayableMessage";

export async function loadReplicants() {
	return {
		sync: {
			availablePorts: await replicant<string[]>("availablePorts", "glimpse-graphics.sync-settings", {
				defaultValue: [],
				persistent: false
			}),
			selectedPort: await replicant<string | null>("selectedPort", "glimpse-graphics.sync-settings", {defaultValue: null}),
			selectedSport: await replicant<string>("selectedSport", "glimpse-graphics.sync-settings", {defaultValue: 'Hockey/Lacrosse'}),
			status: await replicant<{ connected: boolean, bitrate: number }>("status", "glimpse-graphics.sync-settings", {
				defaultValue: {
					connected: false,
					bitrate: 0
				}, persistent: false
			}),
			values: {
				clock: await replicant<boolean>("clock", "glimpse-graphics.sync-settings.values", {defaultValue: false}),
				period: await replicant<boolean>("period", "glimpse-graphics.sync-settings.values", {defaultValue: false}),
				team1: {
					score: await replicant<boolean>("score", "glimpse-graphics.sync-settings.values.team1", {defaultValue: false}),
					name: await replicant<boolean>("name", "glimpse-graphics.sync-settings.values.team1", {defaultValue: false}),
					abbreviation: await replicant<boolean>("abbreviation", "glimpse-graphics.sync-settings.values.team1", {defaultValue: false}),
				},
				team2: {
					score: await replicant<boolean>("score", "glimpse-graphics.sync-settings.values.team2", {defaultValue: false}),
					name: await replicant<boolean>("name", "glimpse-graphics.sync-settings.values.team2", {defaultValue: false}),
					abbreviation: await replicant<boolean>("abbreviation", "glimpse-graphics.sync-settings.values.team2", {defaultValue: false}),
				},
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
			},
			{
				enabled: await replicant<boolean>("enabled", `glimpse-graphics.game-settings.team1`, {defaultValue: true}),
				score: await replicant<number>("score", `glimpse-graphics.scoreboard.team1`, {defaultValue: 0}),
				name: await replicant<string>("name", `glimpse-graphics.game-settings.team1`, {defaultValue: "Team 2"}),
				abbreviation: await replicant<string>("abbreviation", `glimpse-graphics.game-settings.team1`, {defaultValue: "TWO"}),
				primaryColor: await replicant<string>("primaryColor", `glimpse-graphics.game-settings.team1`, {defaultValue: '#ffffff'}),
				secondaryColor: await replicant<string>("secondaryColor", `glimpse-graphics.game-settings.team1`, {defaultValue: '#aaaaaa'}),
				logo: await replicant<string>("logo", `glimpse-graphics.game-settings.team1`, {defaultValue: ''}),
				schoolName: await replicant<string>("schoolName", `glimpse-graphics.game-settings.team1`, {defaultValue: 'School Two'})
			}
		],
		messages: {
			global: await replicant<DisplayableMessage[]>("global", `glimpse-graphics.game-settings.messages`, {defaultValue: []}),
			team1: await replicant<DisplayableMessage[]>("team1", `glimpse-graphics.game-settings.messages`, {defaultValue: []}),
			team2: await replicant<DisplayableMessage[]>("team2", `glimpse-graphics.game-settings.messages`, {defaultValue: []}),
		}
	}
}
