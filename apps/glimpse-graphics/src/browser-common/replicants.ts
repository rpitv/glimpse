import {replicant} from "./replicant";

export async function loadReplicants() {
	return {
		gameSettings: {
			clock: {
				enabled: await replicant<boolean>("enabled", "glimpse-graphics.game-settings.clock", {defaultValue: true}),
				synced: await replicant<boolean>("synced", "glimpse-graphics.game-settings.clock", {defaultValue: false})
			},
			periods: {
				enabled: await replicant<boolean>("enabled", "glimpse-graphics.game-settings.periods", {defaultValue: true}),
				synced: await replicant<boolean>("synced", "glimpse-graphics.game-settings.periods", {defaultValue: false}),
				count: await replicant<number>('count', 'glimpse-graphics.game-settings.periods', {defaultValue: 3}),
				length: await replicant<number>('length', 'glimpse-graphics.game-settings.periods', {defaultValue: 1200_000}),
				overtime: {
					enabled: await replicant<boolean>('enabled', 'glimpse-graphics.game-settings.periods.overtime', {defaultValue: false}),
					count: await replicant<number>('count', 'glimpse-graphics.game-settings.periods.overtime', {defaultValue: 0}),
					length: await replicant<number>('length', 'glimpse-graphics.game-settings.periods.overtime', {defaultValue: 300_000}),
				}
			},
			baseball: {
				bases: {
					enabled: await replicant<boolean>("enabled", "glimpse-graphics.game-settings.baseball.bases", {defaultValue: false}),
					synced: await replicant<boolean>("synced", "glimpse-graphics.game-settings.baseball.bases", {defaultValue: false}),
				},
				bottomTop: {
					enabled: await replicant<boolean>("enabled", "glimpse-graphics.game-settings.baseball.bottomTop", {defaultValue: false}),
					synced: await replicant<boolean>("synced", "glimpse-graphics.game-settings.baseball.bottomTop", {defaultValue: false}),
				},
				outsStrikesBalls: {
					enabled: await replicant<boolean>("enabled", "glimpse-graphics.game-settings.baseball.outsStrikesBalls", {defaultValue: false}),
					synced: await replicant<boolean>("synced", "glimpse-graphics.game-settings.baseball.outsStrikesBalls", {defaultValue: false}),
				}
			},
			football: {
				downs: {
					enabled: await replicant<boolean>("enabled", "glimpse-graphics.game-settings.football.downs", {defaultValue: false}),
					synced: await replicant<boolean>("synced", "glimpse-graphics.game-settings.football.downs", {defaultValue: false}),
				},
				possession: {
					enabled: await replicant<boolean>("enabled", "glimpse-graphics.game-settings.football.possession", {defaultValue: false}),
					synced: await replicant<boolean>("synced", "glimpse-graphics.game-settings.football.possession", {defaultValue: false}),
				},
				playClock: {
					enabled: await replicant<boolean>("enabled", "glimpse-graphics.game-settings.football.playClock", {defaultValue: false}),
					synced: await replicant<boolean>("synced", "glimpse-graphics.game-settings.football.playClock", {defaultValue: false}),
				}
			}
		},
		scoreboard: {
			clock: {
				time: await replicant<number>('time', 'glimpse-graphics.scoreboard.clock', {defaultValue: 1200_000}),
				isRunning: await replicant<boolean>('isRunning', 'glimpse-graphics.scoreboard.clock', {defaultValue: false, persistent: false}),
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
		]
	}
}