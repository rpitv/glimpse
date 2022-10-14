import { get as nodecg } from './nodecg';
import {DisplayableMessage} from "./DisplayableMessage";

export const replicants = {
	gameSettings: {
		style: nodecg().Replicant<'espn'|'rpitv-modern'|'rpitv-classic'>('style', "glimpse-graphics.game-settings.style", {defaultValue: 'rpitv-modern'}),
		clock: {
			enabled: nodecg().Replicant<boolean>("enabled", "glimpse-graphics.game-settings.clock", {defaultValue: true}),
			synced: nodecg().Replicant<boolean>("synced", "glimpse-graphics.game-settings.clock", {defaultValue: false})
		},
		periods: {
			enabled: nodecg().Replicant<boolean>("enabled", "glimpse-graphics.game-settings.periods", {defaultValue: true}),
			synced: nodecg().Replicant<boolean>("synced", "glimpse-graphics.game-settings.periods", {defaultValue: false}),
			count: nodecg().Replicant<number>('count', 'glimpse-graphics.game-settings.periods', {defaultValue: 3}),
			length: nodecg().Replicant<number>('length', 'glimpse-graphics.game-settings.periods', {defaultValue: 1200_000}),
			overtime: {
				enabled: nodecg().Replicant<boolean>('enabled', 'glimpse-graphics.game-settings.periods.overtime', {defaultValue: false}),
				count: nodecg().Replicant<number>('count', 'glimpse-graphics.game-settings.periods.overtime', {defaultValue: 0}),
				length: nodecg().Replicant<number>('length', 'glimpse-graphics.game-settings.periods.overtime', {defaultValue: 300_000}),
			}
		},
		baseball: {
			bases: {
				enabled: nodecg().Replicant<boolean>("enabled", "glimpse-graphics.game-settings.baseball.bases", {defaultValue: false}),
				synced: nodecg().Replicant<boolean>("synced", "glimpse-graphics.game-settings.baseball.bases", {defaultValue: false}),
			},
			bottomTop: {
				enabled: nodecg().Replicant<boolean>("enabled", "glimpse-graphics.game-settings.baseball.bottomTop", {defaultValue: false}),
				synced: nodecg().Replicant<boolean>("synced", "glimpse-graphics.game-settings.baseball.bottomTop", {defaultValue: false}),
			},
			outsStrikesBalls: {
				enabled: nodecg().Replicant<boolean>("enabled", "glimpse-graphics.game-settings.baseball.outsStrikesBalls", {defaultValue: false}),
				synced: nodecg().Replicant<boolean>("synced", "glimpse-graphics.game-settings.baseball.outsStrikesBalls", {defaultValue: false}),
			}
		},
		football: {
			downs: {
				enabled: nodecg().Replicant<boolean>("enabled", "glimpse-graphics.game-settings.football.downs", {defaultValue: false}),
				synced: nodecg().Replicant<boolean>("synced", "glimpse-graphics.game-settings.football.downs", {defaultValue: false}),
			},
			possession: {
				enabled: nodecg().Replicant<boolean>("enabled", "glimpse-graphics.game-settings.football.possession", {defaultValue: false}),
				synced: nodecg().Replicant<boolean>("synced", "glimpse-graphics.game-settings.football.possession", {defaultValue: false}),
			},
			playClock: {
				enabled: nodecg().Replicant<boolean>("enabled", "glimpse-graphics.game-settings.football.playClock", {defaultValue: false}),
				synced: nodecg().Replicant<boolean>("synced", "glimpse-graphics.game-settings.football.playClock", {defaultValue: false}),
			}
		}
	},
	scoreboard: {
		visible: nodecg().Replicant<boolean>('visible', 'glimpse-graphics.scoreboard', {defaultValue: true}),
		clock: {
			time: nodecg().Replicant<number>('time', 'glimpse-graphics.scoreboard.clock', {defaultValue: 1200_000}),
			isRunning: nodecg().Replicant<boolean>('isRunning', 'glimpse-graphics.scoreboard.clock', {defaultValue: false, persistent: false}),
		},
		period: nodecg().Replicant<number>('period', 'glimpse-graphics.scoreboard', {defaultValue: 1})
	},
	teams: [
		{
			enabled: nodecg().Replicant<boolean>("enabled", `glimpse-graphics.game-settings.team0`, {defaultValue: true}),
			score: nodecg().Replicant<number>("score", `glimpse-graphics.scoreboard.team0`, {defaultValue: 0}),
			name: nodecg().Replicant<string>("name", `glimpse-graphics.game-settings.team0`, {defaultValue: "Team 1"}),
			abbreviation: nodecg().Replicant<string>("abbreviation", `glimpse-graphics.game-settings.team0`, {defaultValue: "ONE"}),
			primaryColor: nodecg().Replicant<string>("primaryColor", `glimpse-graphics.game-settings.team0`, {defaultValue: '#ffffff'}),
			secondaryColor: nodecg().Replicant<string>("secondaryColor", `glimpse-graphics.game-settings.team0`, {defaultValue: '#aaaaaa'}),
			logo: nodecg().Replicant<string>("logo", `glimpse-graphics.game-settings.team0`, {defaultValue: ''}),
			schoolName: nodecg().Replicant<string>("schoolName", `glimpse-graphics.game-settings.team0`, {defaultValue: 'School One'}),
		},
		{
			enabled: nodecg().Replicant<boolean>("enabled", `glimpse-graphics.game-settings.team1`, {defaultValue: true}),
			score: nodecg().Replicant<number>("score", `glimpse-graphics.scoreboard.team1`, {defaultValue: 0}),
			name: nodecg().Replicant<string>("name", `glimpse-graphics.game-settings.team1`, {defaultValue: "Team 2"}),
			abbreviation: nodecg().Replicant<string>("abbreviation", `glimpse-graphics.game-settings.team1`, {defaultValue: "TWO"}),
			primaryColor: nodecg().Replicant<string>("primaryColor", `glimpse-graphics.game-settings.team1`, {defaultValue: '#ffffff'}),
			secondaryColor: nodecg().Replicant<string>("secondaryColor", `glimpse-graphics.game-settings.team1`, {defaultValue: '#aaaaaa'}),
			logo: nodecg().Replicant<string>("logo", `glimpse-graphics.game-settings.team1`, {defaultValue: ''}),
			schoolName: nodecg().Replicant<string>("schoolName", `glimpse-graphics.game-settings.team1`, {defaultValue: 'School Two'})
		}
	],
	messages: {
		global: nodecg().Replicant<DisplayableMessage[]>("global", `glimpse-graphics.game-settings.messages`, {defaultValue: []}),
		team1: nodecg().Replicant<DisplayableMessage[]>("team1", `glimpse-graphics.game-settings.messages`, {defaultValue: []}),
		team2: nodecg().Replicant<DisplayableMessage[]>("team2", `glimpse-graphics.game-settings.messages`, {defaultValue: []}),
	}
}
