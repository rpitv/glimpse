import { replicant } from "./replicant";
import { Announcement } from "../common/Announcement";
import { Credit } from "../common/Credit";
import { StandingsTeam } from "../extension/util/StandingsTeam";

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
			daktronicsFeed: await replicant<"tv" | "rtd" | "">("daktronicsFeed", "glimpse-graphics.sync-settings", {defaultValue: ""}),
			values: {
				clock: await replicant<boolean>("clock", "glimpse-graphics.sync-settings.values", {defaultValue: false}),
				period: await replicant<boolean>("period", "glimpse-graphics.sync-settings.values", {defaultValue: false}),
				teams: [
					{
						score: await replicant<boolean>("score", "glimpse-graphics.sync-settings.values.team1", {defaultValue: false}),
						name: await replicant<boolean>("name", "glimpse-graphics.sync-settings.values.team1", {defaultValue: false}),
						abbreviation: await replicant<boolean>("abbreviation", "glimpse-graphics.sync-settings.values.team1", {defaultValue: false}),
						shots: await replicant<boolean>("shots", "glimpse-graphics.sync-settings.values.team1", {defaultValue: false}),
						timeouts: await replicant<boolean>("timeouts", "glimpse-graphics.sync-settings.values.team1", {defaultValue: false}),
					}, {
						score: await replicant<boolean>("score", "glimpse-graphics.sync-settings.values.team2", {defaultValue: false}),
						name: await replicant<boolean>("name", "glimpse-graphics.sync-settings.values.team2", {defaultValue: false}),
						abbreviation: await replicant<boolean>("abbreviation", "glimpse-graphics.sync-settings.values.team2", {defaultValue: false}),
						shots: await replicant<boolean>("shots", "glimpse-graphics.sync-settings.values.team2", {defaultValue: false}),
						timeouts: await replicant<boolean>("timeouts", "glimpse-graphics.sync-settings.values.team2", {defaultValue: false}),
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
				},
				sogs: await replicant<boolean>("sogs", "glimpse-graphics.sync-settings.values", {defaultValue: false}),
				faceoffs: await replicant<boolean>("faceoffs", "glimpse-graphics.sync-settings.values", {defaultValue: false})
			}
		},
		gameSettings: {
			api: {
				enabled: await replicant<boolean>("enabled", "glimpse-graphics.game-settings.api", {defaultValue: false}),
				key: await replicant<string>("key", `glimpse-graphics.game-settings.api`, {defaultValue: 'CHANGE_ME_API_KEY'}),
				forceReload: await replicant<boolean>("forceReload", "glimpse-graphics.game-settings.api", {defaultValue: false}),
			},
			style: await replicant<'espn' | 'rpitv' | 'football'>('style', 'glimpse-graphics.game-settings.style', {defaultValue: 'rpitv'}),
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
			showShootouts: await replicant<boolean>("showShootouts", 'glimpse-graphics.game-settings',{defaultValue: false}),
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
			period: await replicant<number>('period', 'glimpse-graphics.scoreboard', {defaultValue: 1}),
			playClock: await replicant<number>('playClock', 'glimpse-graphics.playClock', {defaultValue: 0}),
			down: await replicant<number>('down', 'glimpse-graphics.down', {defaultValue: 1}),
			yardsToGo: await replicant<string>('yardsToGo', 'glimpse-graphics.yardsToGo', {defaultValue: ""}),
			possession: await replicant<string>('possession', 'glimpse-graphics.possession', {defaultValue: ''}),
			penalty: await replicant<boolean>("penalty", "glimpse-graphics.penalty", {defaultValue: true}),
		},
		teams: [
			{
				enabled: await replicant<boolean>("enabled", `glimpse-graphics.game-settings.team0`, {defaultValue: true}),
				score: await replicant<number>("score", `glimpse-graphics.scoreboard.team0`, {defaultValue: 0}),
				name: await replicant<string>("name", `glimpse-graphics.game-settings.team0`, {defaultValue: "Team 1"}),
				abbreviation: await replicant<string>("abbreviation", `glimpse-graphics.game-settings.team0`, {defaultValue: "ONE"}),
				primaryColor: await replicant<string>("primaryColor", `glimpse-graphics.game-settings.team0`, {defaultValue: '#ffffff'}),
				secondaryColor: await replicant<string>("secondaryColor", `glimpse-graphics.game-settings.team0`, {defaultValue: '#aaaaaa'}),
				scoreboardPrimaryColor: await replicant<string>("scoreboardPrimaryColor", `glimpse-graphics.game-settings.team0`, {defaultValue: '#ffffff'}),
				scoreboardSecondaryColor: await replicant<string>("scoreboardSecondaryColor", `glimpse-graphics.game-settings.team0`, {defaultValue: '#aaaaaa'}),
				logo: await replicant<string>("logo", `glimpse-graphics.game-settings.team0`, {defaultValue: ''}),
				schoolName: await replicant<string>("schoolName", `glimpse-graphics.game-settings.team0`, {defaultValue: 'School One'}),
				shots: await replicant<number>("shots", `glimpse-graphics.game-settings.team0`, {defaultValue: 0}),
				player1PenaltyNumber: await replicant<string>("player1PenaltyNumber", `glimpse-graphics.game-settings.team0`, {defaultValue: ""}),
				player1PenaltyClock: await replicant<string>("player1PenaltyClock", `glimpse-graphics.game-settings.team0`, {defaultValue: ""}),
				player2PenaltyNumber: await replicant<string>("player2PenaltyNumber", `glimpse-graphics.game-settings.team0`, {defaultValue: ""}),
				player2PenaltyClock: await replicant<string>("player2PenaltyClock", `glimpse-graphics.game-settings.team0`, {defaultValue: ""}),
				timeouts: await replicant<number>("timeouts", `glimpse-graphics.game-settings.team0`, {defaultValue: 0}),
				shootouts: await replicant<string>("shootouts", `glimpse-graphics.game-settings.team0`, {defaultValue: ""})
			},
			{
				enabled: await replicant<boolean>("enabled", `glimpse-graphics.game-settings.team1`, {defaultValue: true}),
				score: await replicant<number>("score", `glimpse-graphics.scoreboard.team1`, {defaultValue: 0}),
				name: await replicant<string>("name", `glimpse-graphics.game-settings.team1`, {defaultValue: "Team 2"}),
				abbreviation: await replicant<string>("abbreviation", `glimpse-graphics.game-settings.team1`, {defaultValue: "TWO"}),
				primaryColor: await replicant<string>("primaryColor", `glimpse-graphics.game-settings.team1`, {defaultValue: '#ffffff'}),
				secondaryColor: await replicant<string>("secondaryColor", `glimpse-graphics.game-settings.team1`, {defaultValue: '#aaaaaa'}),
				scoreboardPrimaryColor: await replicant<string>("scoreboardPrimaryColor", `glimpse-graphics.game-settings.team1`, {defaultValue: '#ffffff'}),
				scoreboardSecondaryColor: await replicant<string>("scoreboardSecondaryColor", `glimpse-graphics.game-settings.team1`, {defaultValue: '#aaaaaa'}),
				logo: await replicant<string>("logo", `glimpse-graphics.game-settings.team1`, {defaultValue: ''}),
				schoolName: await replicant<string>("schoolName", `glimpse-graphics.game-settings.team1`, {defaultValue: 'School Two'}),
				shots: await replicant<number>("shots", `glimpse-graphics.game-settings.team1`, {defaultValue: 0}),
				player1PenaltyNumber: await replicant<string>("player1PenaltyNumber", `glimpse-graphics.game-settings.team1`, {defaultValue: ""}),
				player1PenaltyClock: await replicant<string>("player1PenaltyClock", `glimpse-graphics.game-settings.team1`, {defaultValue: ""}),
				player2PenaltyNumber: await replicant<string>("player2PenaltyNumber", `glimpse-graphics.game-settings.team1`, {defaultValue: ""}),
				player2PenaltyClock: await replicant<string>("player2PenaltyClock", `glimpse-graphics.game-settings.team1`, {defaultValue: ""}),
				timeouts: await replicant<number>("timeouts", `glimpse-graphics.game-settings.team1`, {defaultValue: 0}),
				shootouts: await replicant<string>("shootouts", `glimpse-graphics.game-settings.team1`, {defaultValue: ""})
			}
		],
		announcements: {
			global: await replicant<Announcement[]>("global", `glimpse-graphics.game-settings.announcements`, {defaultValue: []}),
			team1: await replicant<Announcement[]>("team1", `glimpse-graphics.game-settings.announcements`, {defaultValue: []}),
			team2: await replicant<Announcement[]>("team2", `glimpse-graphics.game-settings.announcements`, {defaultValue: []}),
		},
		fullscreen: {
			credits: {
				credit: await replicant<Credit[]>("credit", `glimpse-graphics.graphics.fullscreen.credits`, {defaultValue: []}),
				show: await replicant<boolean>("show", `glimpse-graphics.graphics.fullscreen.credits`, {defaultValue: false}),
			},
            standings: {
                teams: await replicant<StandingsTeam[]>("teams", `glimpse-graphics.graphics.fullscreen.teams`, {defaultValue: []}),
                show: await replicant<boolean>("show", `glimpse-graphics.graphics.fullscreen.standings`, {defaultValue: false}),
                title: await replicant<string>("title", `glimpse-graphics.graphics.fullscreen.standings`, {defaultValue: ""}),
                subtitle: await replicant<string>("subtitle", `glimpse-graphics.graphics.fullscreen.standings`, {defaultValue: ""}),
                headerLogoLink: await replicant<string>("headerLogoLink", `glimpse-graphics.graphics.fullscreen.standings`, {defaultValue: ""}),
            }
		},
		lowerThird: {
			bug: {
				show: await replicant<boolean>("show", `glimpse-graphics.graphics.lowerThird.bug`, {defaultValue: true}),
				offsetX: await replicant<number>("offsetX", `glimpse-graphics.graphics.lowerThird.bug`, {defaultValue: 0}),
				offsetY: await replicant<number>("offsetY", `glimpse-graphics.graphics.lowerThird.bug`, {defaultValue: 0}),
			},
			commentators: {
				leftPerson: {
					name: await replicant<string>("name", `glimpse-graphics.graphics.lowerThird.commentators.leftPerson`, {defaultValue: ""}),
					nameColor: await replicant<string>("nameColor", `glimpse-graphics.graphics.lowerThird.commentators.leftPerson`, {defaultValue: "#000000"}),
					nameSize: await replicant<number>("nameSize", `glimpse-graphics.graphics.lowerThird.commentators.leftPerson`, {defaultValue: 0}),
					description: await replicant<string>("description", `glimpse-graphics.graphics.lowerThird.commentators.leftPerson`, {defaultValue: ""}),
					descriptionColor: await replicant<string>("descriptionColor", `glimpse-graphics.graphics.lowerThird.commentators.leftPerson`, {defaultValue: ""}),
					descriptionSize: await replicant<number>("descriptionSize", `glimpse-graphics.graphics.lowerThird.commentators.leftPerson`, {defaultValue: 0}),
				},
				centerPerson: {
					name: await replicant<string>("name", `glimpse-graphics.graphics.lowerThird.commentatorsCenterPerson`, {defaultValue: ""}),
					nameColor: await replicant<string>("nameColor", `glimpse-graphics.graphics.lowerThird.commentators.centerPerson`, {defaultValue: "#000000"}),
					nameSize: await replicant<number>("nameSize", `glimpse-graphics.graphics.lowerThird.commentators.centerPerson`, {defaultValue: 0}),
					description: await replicant<string>("centerDesc", `glimpse-graphics.graphics.lowerThird.commentators.centerPerson`, {defaultValue: ""}),
					descriptionColor: await replicant<string>("descriptionColor", `glimpse-graphics.graphics.lowerThird.commentators.centerPerson`, {defaultValue: ""}),
					descriptionSize: await replicant<number>("descriptionSize", `glimpse-graphics.graphics.lowerThird.commentators.centerPerson`, {defaultValue: 0}),
				},
				rightPerson:{
					name: await replicant<string>("name", `glimpse-graphics.graphics.lowerThird.commentators.rightPerson`, {defaultValue: ""}),
					nameColor: await replicant<string>("nameColor", `glimpse-graphics.graphics.lowerThird.commentators.rightPerson`, {defaultValue: "#000000"}),
					nameSize: await replicant<number>("nameSize", `glimpse-graphics.graphics.lowerThird.commentators.rightPerson`, {defaultValue: 0}),
					description: await replicant<string>("rightDesc", `glimpse-graphics.graphics.lowerThird.commentators.rightPerson`, {defaultValue: ""}),
					descriptionColor: await replicant<string>("descriptionColor", `glimpse-graphics.graphics.lowerThird.commentators.rightPerson`, {defaultValue: ""}),
					descriptionSize: await replicant<number>("descriptionSize", `glimpse-graphics.graphics.lowerThird.commentators.rightPerson`, {defaultValue: 0}),
				},
				offsetY: await replicant<number>("offsetY", `glimpse-graphics.graphics.lowerThird.commentators`, {defaultValue: 0}),
				show: await replicant<boolean>("show", `glimpse-graphics.graphics.lowerThird.commentators`, {defaultValue: false}),
			},
			copyright: {
				show: await replicant<boolean>("show", `glimpse-graphics.graphics.lowerThird.copyright`, {defaultValue: false}),
				offsetX: await replicant<number>("offsetX", `glimpse-graphics.graphics.lowerThird.copyright`, {defaultValue: 0}),
				offsetY: await replicant<number>("offsetY", `glimpse-graphics.graphics.lowerThird.copyright`, {defaultValue: 0}),
				text: await replicant<string>("text", `glimpse-graphics.graphics.lowerThird.copyright`, {defaultValue: ""}),
				textColor: await replicant<string>("textColor", `glimpse-graphics.graphics.lowerThird.copyright`, {defaultValue: "#000000"}),
				textSize: await replicant<number>("textSize", `glimpse-graphics.graphics.lowerThird.copyright`, {defaultValue: 0}),
			},
			locator: {
				leftTeam: {
					name: await replicant<string>("name", `glimpse-graphics.graphics.lowerThird.locator.leftTeam`, {defaultValue: ""}),
					nameColor: await replicant<string>("nameColor", `glimpse-graphics.graphics.lowerThird.locator.leftTeam`, {defaultValue: "#000000"}),
					nameSize: await replicant<number>("nanmeSize", `glimpse-graphics.graphics.lowerThird.locator.leftTeam`,{defaultValue: 0}),
					logo: await replicant<string>("logo", `glimpse-graphics.graphics.lowerThird.locator.leftTeam`, {defaultValue: ""}),
					logoSize: await replicant<number>("logoSize", `glimpse-graphics.graphics.lowerThird.locator.leftTeam`, {defaultValue: 100}),
					primaryColor: await replicant<string>("primaryColor", `glimpse-graphics.graphics.lowerThird.locator.leftTeam`, {defaultValue: ""}),
					secondaryColor: await replicant<string>("secondaryColor", `glimpse-graphics.graphics.lowerThird.locator.leftTeam`, {defaultValue: ""}),
				},
				rightTeam: {
					name: await replicant<string>("name", `glimpse-graphics.graphics.lowerThird.locator.rightTeam`, {defaultValue: ""}),
					nameColor: await replicant<string>("nameColor", `glimpse-graphics.graphics.lowerThird.locator.rightTeam`, {defaultValue: "#000000"}),
					nameSize: await replicant<number>("nameSize", `glimpse-graphics.graphics.lowerThird.locator.rightTeam`,{defaultValue: 0}),
					logo: await replicant<string>("logo", `glimpse-graphics.graphics.lowerThird.locator.rightTeam`, {defaultValue: ""}),
					logoSize: await replicant<number>("logoSize", `glimpse-graphics.graphics.lowerThird.locator.rightTeam`, {defaultValue: 100}),
					primaryColor: await replicant<string>("primaryColor", `glimpse-graphics.graphics.lowerThird.locator.rightTeam`, {defaultValue: ""}),
					secondaryColor: await replicant<string>("secondaryColor", `glimpse-graphics.graphics.lowerThird.locator.rightTeam`, {defaultValue: ""}),
				},
				location: {
					name: await replicant<string>("name", `glimpse-graphics.graphics.lowerThird.locator.location`, {defaultValue: ""}),
					nameColor: await replicant<string>("nameColor", `glimpse-graphics.graphics.lowerThird.locator.location`, {defaultValue: ""}),
					nameSize: await replicant<number>("nameSize", `glimpse-graphics.graphics.lowerThird.locator.location`, {defaultValue: 0}),
				},
				show: await replicant<boolean>("show", `glimpse-grpahics.graphics.lowerThird.locator`, {defaultValue: false})
			},
			playerBio: {
				action: {
					description: await replicant<string>("description", `glimpse-graphics.graphics.lowerThird.playerBio.action`, {defaultValue: ""}),
					fontSize: await replicant<number>("fontSize", `glimpse-graphics.graphics.lowerThird.playerBio.action`, {defaultValue: 0}),
					player: {
						name: await replicant<string>("name", `glimpse-graphics.graphics.lowerThird.playerBio.player`, {defaultValue: ""}),
						number: await replicant<string>("number", `glimpse-graphics.graphics.lowerThird.playerBio.player`, {defaultValue: ""}),
						teamSide: await replicant<"leftTeam" | "rightTeam"| "">("teamSide", `glimpse-graphics.graphics.lowerThird.playerBio.player`, {defaultValue: "rightTeam"}),
					},
				},
				image: {
					url: await replicant<string>("url", `glimpse-graphics.graphics.lowerThird.playerBio.image`, {defaultValue: ""}),
					defaultTeamColor: await replicant<string>("defaultTeamColor", `glimpse-graphics.graphics.lowerThird.playerBio.image`, {defaultValue: "#000000"}),
          leftTeam: {
            sync: await replicant<boolean>("sync", `glimpse-graphics.graphics.lowerThird.playerBio.image.leftTeam`, {defaultValue: true}),
            color: await replicant("color", `glimpse-graphics.graphics.lowerThird.playerBio.image.leftTeam`, {defaultValue: "#000000"}),
          },
          rightTeam: {
            sync: await replicant<boolean>("sync", `glimpse-graphics.graphics.lowerThird.playerBio.image.rightTeam`, {defaultValue: true}),
            color: await replicant("color", `glimpse-graphics.graphics.lowerThird.playerBio.image.rightTeam`, {defaultValue: "#000000"}),
          }
				},
				offset: await replicant<number>("offset", `glimpse-graphics.graphics.lowerThird.playerBio`, {defaultValue: 0}),
				info: {
					show: await replicant<boolean>("show", `glimpse-graphics.graphics.lowerThird.playerBio.info`, {defaultValue: false}),
					height: await replicant<string>("height", `glimpse-graphics.graphics.lowerThird.playerBio.info`, {defaultValue: ""}),
					weight: await replicant<string>("weight", `glimpse-graphics.graphics.lowerThird.playerBio.info`, {defaultValue: ""}),
					year: await replicant<string>("year", `glimpse-graphics.graphics.lowerThird.playerBio.info`, {defaultValue: ""}),
					hometown: await replicant<string>("hometown", `glimpse-graphics.graphics.lowerThird.playerBio.info`, {defaultValue: ""}),
				},
				show: await replicant<boolean>("show", `glimpse-graphics.graphics.lowerThird.playerBio`, {defaultValue: false}),
			},
			scoreboard: {
				description: {
					autoFit: await replicant<boolean>("autoFit", `glimpse-graphics.graphics.lowerThird.scoreboard.description`, {defaultValue: true}),
					fontSize: await replicant<number>("fontSize", `glimpse-graphics.graphics.lowerThird.scoreboard.description`, {defaultValue: 0}),
					fontColor: await replicant<string>("fontColor", `glimpse-graphics.graphics.lowerThird.scoreboard.description`, {defaultValue: "#000000"}),
					text: await replicant<string>("text", `glimpse-graphics.graphics.lowerThird.scoreboard.description`, {defaultValue: ""}),
					timer: await replicant<boolean>("timer", `glimpse-graphics.graphics.lowerThird.scoreboard.description`, {defaultValue: false}),
				},
				leftTeam: {
					name: await replicant<string>("name", `glimpse-graphics.graphics.lowerThird.scoreboard.leftTeam`, {defaultValue: ""}),
					nameColor: await replicant<string>("nameColor", `glimpse-graphics.graphics.lowerThird.scoreboard.leftTeam`, {defaultValue: "#000000"}),
					nameSize: await replicant<number>("nameSize", `glimpse-graphics.graphics.lowerThird.scoreboard.leftTeam`,{defaultValue: 0}),
					logo: await replicant<string>("logo", `glimpse-graphics.graphics.lowerThird.scoreboard.leftTeam`, {defaultValue: ""}),
					logoSize: await replicant<number>("logoSize", `glimpse-graphics.graphics.lowerThird.scoreboard.leftTeam`, {defaultValue: 100}),
					primaryColor: await replicant<string>("primaryColor", `glimpse-graphics.graphics.lowerThird.scoreboard.leftTeam`, {defaultValue: ""}),
					score: await replicant<number>("score", `glimpse-graphics.graphics.lowerThird.scoreboard.leftTeam`, {defaultValue: 0}),
					scoreColor: await replicant<string>("scoreColor", `glimpse-graphics.graphics.lowerThird.scoreboard.leftTeam`, {defaultValue: ""}),
					scoreSize: await replicant<number>("scoreSize", `glimpse-graphics.graphics.lowerThird.scoreboard.leftTeam`, {defaultValue: 0}),
					secondaryColor: await replicant<string>("secondaryColor", `glimpse-graphics.graphics.lowerThird.scoreboard.leftTeam`, {defaultValue: ""}),
				},
				rightTeam: {
					name: await replicant<string>("name", `glimpse-graphics.graphics.lowerThird.scoreboard.rightTeam`, {defaultValue: ""}),
					nameColor: await replicant<string>("nameColor", `glimpse-graphics.graphics.lowerThird.scoreboard.rightTeam`, {defaultValue: "#000000"}),
					nameSize: await replicant<number>("nameSize", `glimpse-graphics.graphics.lowerThird.scoreboard.rightTeam`,{defaultValue: 0}),
					logo: await replicant<string>("logo", `glimpse-graphics.graphics.lowerThird.scoreboard.rightTeam`, {defaultValue: ""}),
					logoSize: await replicant<number>("logoSize", `glimpse-graphics.graphics.lowerThird.scoreboard.rightTeam`, {defaultValue: 100}),
					primaryColor: await replicant<string>("primaryColor", `glimpse-graphics.graphics.lowerThird.scoreboard.rightTeam`, {defaultValue: ""}),
					score: await replicant<number>("score", `glimpse-graphics.graphics.lowerThird.scoreboard.rightTeam`, {defaultValue: 0}),
					scoreColor: await replicant<string>("scoreColor", `glimpse-graphics.graphics.lowerThird.scoreboard.rightTeam`, {defaultValue: ""}),
					scoreSize: await replicant<number>("scoreSize", `glimpse-graphics.graphics.lowerThird.scoreboard.rightTeam`, {defaultValue: 0}),
					secondaryColor: await replicant<string>("secondaryColor", `glimpse-graphics.graphics.lowerThird.scoreboard.rightTeam`, {defaultValue: ""}),
				},
				show: await replicant<boolean>("show", `glimpse-graphics.graphics.lowerThird.scoreboard`, {defaultValue: false}),
			},
			endGraphics: {
				disabled: await replicant<boolean>("disabled", `glimpse-graphics.images.endGraphics`, {defaultValue: false}),
				show: await replicant<boolean>("show", `glimpse-graphics.images.endGraphics`, {defaultValue: false}),
				title: await replicant<string>("title", `glimpse-graphics.images.endGraphics`, {defaultValue: "RPI TV Crew"}),
				message: await replicant<string>("message", `glimpse-graphics.images.endGraphics`, {defaultValue: "Director\nProducer\nReplay Operator\nCamera Operator"}),
				length: await replicant<number>('length', 'glimpse-graphics.endGraphics', {defaultValue: 30}),
				type: await replicant<'scroll' | 'box'>("type", `glimpse-graphics.images.endGraphics`, {defaultValue: 'box'}),
			},
			showProduced: await replicant<boolean>("showProduced", `glimpse-graphics.graphics.lowerThird`, {defaultValue: false}),
		},
		slideshow: {
			enabled: await replicant<boolean>("enabled", `glimpse-graphics.graphics.slideshow`, {defaultValue: false}),
			interval: await replicant<number>("interval", `glimpse-graphics.graphics.slideshow`, {defaultValue: 5})
		},
		http: {
			sidearms: {
				url: await replicant<string>("url", `glimpse-graphics.graphics.sidearms`, {defaultValue: "https://www.sidearmstats.com/rpi/mhockey/1.xml"}),
				body: await replicant<any>("body", `glimpse-graphics.graphics.sidearms`, {defaultValue: {}})
			},
			roster: {
				leftTeam: {
					url: await replicant<string>("url", `glimpse-graphics.graphics.roster.leftTeam`, {defaultValue: "https://rpiathletics.com/sports/mens-ice-hockey/roster/2024-25"}),
					body: await replicant<any>("body", `glimpse-graphics.graphics.roster.leftTeam`, {defaultValue: {}}),
					fetch: await replicant<boolean>("fetch", `glimpse-graphics.graphics.roster.leftTeam`, {defaultValue: false}),
					jersey: await replicant<string>("jersey", `glimpse-graphics.graphics.roster.leftTeam`, {defaultValue: ""}),
				},
				rightTeam: {
					url: await replicant<string>("url", `glimpse-graphics.graphics.roster.rightTeam`, {defaultValue: "https://rpiathletics.com/sports/mens-ice-hockey/roster/2024-25"}),
					body: await replicant<any>("body", `glimpse-graphics.graphics.roster.rightTeam`, {defaultValue: {}}),
					fetch: await replicant<boolean>("fetch", `glimpse-graphics.graphics.roster.rightTeam`, {defaultValue: false}),
					jersey: await replicant<string>("jersey", `glimpse-graphics.graphics.roster.rightTeam`, {defaultValue: ""}),
				}
			}
		}
	}
}

