/*
Script to parse the definitions from the Daktronics RTD manual ED-12483. Copy the table from the manual into the
string "str". A sample of a few lines from the hockey/lacrosse section is included below.

const str = `1 Main Clock Time (mm:ss/ss.t ) 1 5 L
2 Main Clock Time (mm:ss.t ) 6 8 L
14 Home Team Abbreviation 88 10 L Future
15 Guest Team Abbreviation 98 10 L Future
16 Home Team Score 108 4 R
17 Guest Team Score 112 4 R`;

let regex = /(?:\d+ (.+?) (\d+) (\d+) (L|R))+/g;
const matches = {};

let match;
while((match = regex.exec(str))) {
	matches[parseInt(match[2])] = {
	  length: parseInt(match[3]),
	  justification: match[4],
	  title: match[1]
	};
}

console.log(matches);
 */


import {
	awayScoreHandler,
	homeScoreHandler,
	homeShotHandler,
	mainClockHandler,
	periodHandler,
	awayShotHandler,
	homePenalty1Handler,
	homePenalty2Handler,
	awayPenalty1Handler,
	awayPenalty2Handler,
	timeoutsHandler,
	playClockHandler,
	downHandler, yardsToGoHandler, possessionHandler
} from "./handlers";


type PacketDefinition = { length: number, title: string, justification: 'L'|'R', handler?: (value: string) => void };
type SportDefinition = { [key: number]: PacketDefinition };

export const sports: { [key: string]: SportDefinition } = {
	"Football": {
		"1": {
			"length": 5,
			"justification": "L",
			"title": "Main Clock Time (mm:ss/ss.t)",
			handler: mainClockHandler
		},
		"6": {
			"length": 8,
			"justification": "L",
			"title": "Main Clock Time (mm:ss.t)"
		},
		"14": {
			"length": 5,
			"justification": "L",
			"title": "Main Clock/Time Out/TOD (mm:ss/ss.t) ",
		},
		"19": {
			"length": 8,
			"justification": "L",
			"title": "Main Clock/Time Out/TOD (mm:ss.t)",
		},
		"27": {
			"length": 1,
			"justification": "L",
			"title": "Main Clock =0 (' ' or 'z') ",
		},
		"28": {
			"length": 1,
			"justification": "L",
			"title": "Main Clock Stopped (' ' or 's')",
		},
		"29": {
			"length": 1,
			"justification": "L",
			"title": "Main Clock/Time Out Horn (' ' or 'h') ",
		},
		"30": {
			"length": 1,
			"justification": "L",
			"title": "Main Clock Horn (' ' or 'h') ",
		},
		"31": {
			"length": 1,
			"justification": "L",
			"title": "Time Out Horn (' ' or 'h'",
		},
		"32": {
			"length": 8,
			"justification": "L",
			"title": "Time Out Time (mm:ss)",
		},
		"40": {
			"length": 8,
			"justification": "L",
			"title": "Time of Day (hh:mm:ss)",
		},
		"48": {
			"length": 20,
			"justification": "L",
			"title": "Home Team Name",
		},
		"68": {
			"length": 20,
			"justification": "L",
			"title": "Guest Team Name",
		},
		"88": {
			"length": 10,
			"justification": "L",
			"title": "Home Team Abbreviation",
		},
		"98": {
			"length": 10,
			"justification": "L",
			"title": "Guest Team Abbreviation",
		},
		"108": {
			"length": 4,
			"justification": "R",
			"title": "Home Team Score",
			handler: homeScoreHandler
		},
		"112": {
			"length": 4,
			"justification": "R",
			"title": "Guest Team Score",
			handler: awayScoreHandler
		},
		"116": {
			"length": 16,
			"justification": "R",
			"title": "Home Time Outs Left - Full",
			handler: timeoutsHandler
		},
		"118": {
			"length": 2,
			"justification": "R",
			"title": "Home Time Outs Left - Partial",
		},
		"120": {
			"length": 2,
			"justification": "R",
			"title": "Home Time Outs Left - Television",
		},
		"122": {
			"length": 2,
			"justification": "R",
			"title": "Home Time Outs Left - Total",
		},
		"124": {
			"length": 2,
			"justification": "R",
			"title": "Guest Time Outs Left - Full",
		},
		"126": {
			"length": 2,
			"justification": "R",
			"title": "Guest Time Outs Left - Partial",
		},
		"128": {
			"length": 2,
			"justification": "R",
			"title": "Guest Time Outs Left - Television",
		},
		"130": {
			"length": 2,
			"justification": "R",
			"title": "Guest Time Outs Left - Total",
		},
		"132": {
			"length": 1,
			"justification": "L",
			"title": "Home Time Out Indicator (' ' or '<')",
		},
		"133": {
			"length": 4,
			"justification": "L",
			"title": "Home Time Out Text (' ' or 'TIME') ",
		},
		"137": {
			"length": 1,
			"justification": "L",
			"title": "Guest Time Out Indicator (' ' or '>')",
		},
		"138": {
			"length": 4,
			"justification": "L",
			"title": "Guest Time Out Text (' ' or 'TIME')",
		},
		"142": {
			"length": 2,
			"justification": "R",
			"title": "Quarter",
			handler: periodHandler
		},
		"144": {
			"length": 4,
			"justification": "L",
			"title": "Quarter Text ('1st ', 'OT', 'OT/2')",
		},
		"148": {
			"length": 12,
			"justification": "L",
			"title": "Quarter Description ('End of 1st') ",
		},
		"160": {
			"length": 1,
			"justification": "L",
			"title": "Internal Relay (' ' or 'z', 's', 'h')",
		},
		"161": {
			"length": 1,
			"justification": "L",
			"title": "Ad Panel / Caption Power ('c')",
		},
		"162": {
			"length": 1,
			"justification": "L",
			"title": "Ad Panel / Caption #1 (' ' or 'c') ",
		},
		"163": {
			"length": 1,
			"justification": "L",
			"title": "Ad Panel / Caption #2 (' ' or 'c')",
		},
		"164": {
			"length": 1,
			"justification": "L",
			"title": "Ad Panel / Caption #3 (' ' or 'c')",
		},
		"165": {
			"length": 1,
			"justification": "L",
			"title": "Ad Panel / Caption #4 (' ' or 'c')",
		},
		"166": {
			"length": 35,
			"justification": "R",
			"title": "Reserved for Future Use",
		},
		"201": {
			"length": 8,
			"justification": "L",
			"title": "Play Clock Time (mm:ss) ",
			handler: playClockHandler
		},
		"209": {
			"length": 1,
			"justification": "L",
			"title": "Play Clock Horn (' ' or 'h') ",
		},
		"210": {
			"length": 10,
			"justification": "L",
			"title": "Possession Indicator (' ' or '<'(HOME) | ' ' or '>'(GUEST))",
			handler: possessionHandler
		},
		"211": {
			"length": 4,
			"justification": "L",
			"title": "Home Possession Text (' ' or 'POSS')",

		},
		"215": {
			"length": 1,
			"justification": "L",
			"title": "Guest Possession Indicator (' ' or '>')",
		},
		"216": {
			"length": 4,
			"justification": "L",
			"title": "Guest Possession Text (' ' or 'POSS')",
		},
		"220": {
			"length": 2,
			"justification": "R",
			"title": "Ball On",
		},
		"222": {
			"length": 3,
			"justification": "L",
			"title": "Down ('1st', '2nd', '3rd', '4th')",
			handler: downHandler
		},
		"225": {
			"length": 2,
			"justification": "R",
			"title": "To Go",
			handler: yardsToGoHandler
		},
		"227": {
			"length": 2,
			"justification": "R",
			"title": "Home Score - Period 1",
		},
		"229": {
			"length": 2,
			"justification": "R",
			"title": "Home Score - Period 2",
		},
		"231": {
			"length": 2,
			"justification": "R",
			"title": "Home Score - Period 3",
		},
		"233": {
			"length": 2,
			"justification": "R",
			"title": "Home Score - Period 4",
		},
		"235": {
			"length": 2,
			"justification": "R",
			"title": "Home Score - Period 5",
		},
		"237": {
			"length": 2,
			"justification": "R",
			"title": "Home Score - Period 6",
		},
		"239": {
			"length": 2,
			"justification": "R",
			"title": "Home Score - Period 7",
		},
		"241": {
			"length": 2,
			"justification": "R",
			"title": "Home Score - Period 8",
		},
		"243": {
			"length": 2,
			"justification": "R",
			"title": "Home Score - Period 9",
		},
		"245": {
			"length": 2,
			"justification": "R",
			"title": "Home Score - Current Period",
		},
		"247": {
			"length": 2,
			"justification": "R",
			"title": "Guest Score - Period 1",
		},
		"249": {
			"length": 2,
			"justification": "R",
			"title": "Guest Score - Period 2",
		},
		"251": {
			"length": 2,
			"justification": "R",
			"title": "Guest Score - Period 3",
		},
		"253": {
			"length": 2,
			"justification": "R",
			"title": "Guest Score - Period 4",
		},
		"255": {
			"length": 2,
			"justification": "R",
			"title": "Guest Score - Period 5",
		},
		"257": {
			"length": 2,
			"justification": "R",
			"title": "Guest Score - Period 6",
		},
		"259": {
			"length": 2,
			"justification": "R",
			"title": "Guest Score - Period 7",
		},
		"261": {
			"length": 2,
			"justification": "R",
			"title": "Guest Score - Period 8",
		},
		"263": {
			"length": 2,
			"justification": "R",
			"title": "Guest Score - Period 9",
		},
		"265": {
			"length": 2,
			"justification": "R",
			"title": "Guest Score - Current Period",
		},
		"267": {
			"length": 4,
			"justification": "R",
			"title": "Home Rushing Yards",
		},
		"271": {
			"length": 4,
			"justification": "R",
			"title": "Home Passing Yards",
		},
		"275": {
			"length": 4,
			"justification": "R",
			"title": "Home Total Yards",
		},
		"279": {
			"length": 4,
			"justification": "R",
			"title": "Guest Rushing Yards",
		},
		"283": {
			"length": 4,
			"justification": "R",
			"title": "Guest Passing Yards",
		},
		"287": {
			"length": 4,
			"justification": "R",
			"title": "Guest Total Yards",
		},
		"291": {
			"length": 2,
			"justification": "R",
			"title": "Home First Downs",
		},
		"293": {
			"length": 2,
			"justification": "R",
			"title": "Guest First Downs",
		}
	},
	'Hockey/Lacrosse': {
		"1": {
			"length": 5,
			"justification": "L",
			"title": "Main Clock Time (mm:ss/ss.t )",
			handler: mainClockHandler
		},
		"6": {
			"length": 8,
			"justification": "L",
			"title": "Main Clock Time (mm:ss.t )"
		},
		"14": {
			"length": 5,
			"justification": "L",
			"title": "Main Clock/Time Out/TOD (mm:ss/ss.t )"
		},
		"19": {
			"length": 8,
			"justification": "L",
			"title": "Main Clock/Time Out/TOD (mm:ss.t )"
		},
		"27": {
			"length": 1,
			"justification": "L",
			"title": "Main Clock =0 (' ' or 'z')"
		},
		"28": {
			"length": 1,
			"justification": "L",
			"title": "Main Clock Stopped (' ' or 's')"
		},
		"29": {
			"length": 1,
			"justification": "L",
			"title": "Main Clock/Time Out Horn (' ' or 'h')"
		},
		"30": {
			"length": 1,
			"justification": "L",
			"title": "Main Clock Horn (' ' or 'h')"
		},
		"31": {
			"length": 1,
			"justification": "L",
			"title": "Time Out Horn (' ' or 'h')"
		},
		"32": {
			"length": 8,
			"justification": "L",
			"title": "Time Out Time (mm:ss)"
		},
		"40": {
			"length": 8,
			"justification": "L",
			"title": "Time of Day (hh:mm:ss)"
		},
		"48": {
			"length": 20,
			"justification": "L",
			"title": "Home Team Name"
		},
		"68": {
			"length": 20,
			"justification": "L",
			"title": "Guest Team Name"
		},
		"88": {
			"length": 10,
			"justification": "L",
			"title": "Home Team Abbreviation"
		},
		"98": {
			"length": 10,
			"justification": "L",
			"title": "Guest Team Abbreviation"
		},
		"108": {
			"length": 4,
			"justification": "R",
			"title": "Home Team Score",
			handler: homeScoreHandler
		},
		"112": {
			"length": 4,
			"justification": "R",
			"title": "Guest Team Score",
			handler: awayScoreHandler
		},
		"116": {
			"length": 2,
			"justification": "R",
			"title": "Home Time Outs Left - Full"
		},
		"118": {
			"length": 2,
			"justification": "R",
			"title": "Home Time Outs Left - Partial"
		},
		"120": {
			"length": 2,
			"justification": "R",
			"title": "Home Time Outs Left - Television"
		},
		"122": {
			"length": 2,
			"justification": "R",
			"title": "Home Time Outs Left - Total"
		},
		"124": {
			"length": 2,
			"justification": "R",
			"title": "Guest Time Outs Left - Full"
		},
		"126": {
			"length": 2,
			"justification": "R",
			"title": "Guest Time Outs Left - Partial"
		},
		"128": {
			"length": 2,
			"justification": "R",
			"title": "Guest Time Outs Left - Television"
		},
		"130": {
			"length": 2,
			"justification": "R",
			"title": "Guest Time Outs Left - Total"
		},
		"132": {
			"length": 1,
			"justification": "L",
			"title": "Home Time Out Indicator (' ' or '<')"
		},
		"133": {
			"length": 4,
			"justification": "L",
			"title": "Home Time Out Text (' ' or 'TIME')"
		},
		"137": {
			"length": 1,
			"justification": "L",
			"title": "Guest Time Out Indicator (' ' or '>')"
		},
		"138": {
			"length": 4,
			"justification": "L",
			"title": "Guest Time Out Text (' ' or 'TIME')"
		},
		"142": {
			"length": 2,
			"justification": "R",
			"title": "Period",
			handler: periodHandler
		},
		"144": {
			"length": 4,
			"justification": "L",
			"title": "Period Text ('1st ', 'OT', 'OT/2')"
		},
		"148": {
			"length": 12,
			"justification": "L",
			"title": "Period Description ('End of 1st ')"
		},
		"160": {
			"length": 1,
			"justification": "L",
			"title": "Internal Relay (' ' or 'z', 's', 'h')"
		},
		"161": {
			"length": 1,
			"justification": "L",
			"title": "Ad Panel / Caption Power ('c')"
		},
		"162": {
			"length": 1,
			"justification": "L",
			"title": "Ad Panel / Caption #1 (' ' or 'c')"
		},
		"163": {
			"length": 1,
			"justification": "L",
			"title": "Ad Panel / Caption #2 (' ' or 'c')"
		},
		"164": {
			"length": 1,
			"justification": "L",
			"title": "Ad Panel / Caption #3 (' ' or 'c')"
		},
		"165": {
			"length": 1,
			"justification": "L",
			"title": "Ad Panel / Caption #4 (' ' or 'c')"
		},
		"166": {
			"length": 35,
			"justification": "R",
			"title": "Reserved for Future Use"
		},
		"201": {
			"length": 8,
			"justification": "L",
			"title": "Shot Clock Time (mm:ss)"
		},
		"209": {
			"length": 1,
			"justification": "L",
			"title": "Shot Clock Horn (' ' or 'h')"
		},
		"210": {
			"length": 8,
			"justification": "L",
			"title": "Inverse Time Clock (mm:ss)"
		},
		"218": {
			"length": 8,
			"justification": "L",
			"title": "Inverse/Main/Time Out/TOD (mm:ss)"
		},
		"226": {
			// Length is 10 instead of 2 because the clock is in here for some reason
			"length": 10,
			"justification": "R",
			"title": "Home Player #1-Number",
			handler: homePenalty1Handler
		},
		"228": {
			"length": 8,
			"justification": "L",
			"title": "Home Player #1-Penalty Time (mm:ss)"
		},
		"236": {
			"length": 10,
			"justification": "R",
			"title": "Home Player #2-Number",
			handler: homePenalty2Handler
		},
		"238": {
			"length": 8,
			"justification": "L",
			"title": "Home Player #2-Penalty Time (mm:ss)"
		},
		"246": {
			"length": 2,
			"justification": "R",
			"title": "Home Player #3-Number"
		},
		"248": {
			"length": 8,
			"justification": "L",
			"title": "Home Player #3-Penalty Time (mm:ss)"
		},
		"256": {
			"length": 2,
			"justification": "R",
			"title": "Home Player #4-Number"
		},
		"258": {
			"length": 8,
			"justification": "L",
			"title": "Home Player #4-Penalty Time (mm:ss)"
		},
		"266": {
			"length": 2,
			"justification": "R",
			"title": "Home Player #5-Number"
		},
		"268": {
			"length": 8,
			"justification": "L",
			"title": "Home Player #5-Penalty Time (mm:ss)"
		},
		"276": {
			"length": 2,
			"justification": "R",
			"title": "Home Player #6-Number"
		},
		"278": {
			"length": 8,
			"justification": "L",
			"title": "Home Player #6-Penalty Time (mm:ss)"
		},
		"286": {
			"length": 10,
			"justification": "R",
			"title": "Guest Player #1-Number",
			handler: awayPenalty1Handler
		},
		"288": {
			"length": 8,
			"justification": "L",
			"title": "Guest Player #1-Penalty Time (mm:ss)"
		},
		"296": {
			"length": 10,
			"justification": "R",
			"title": "Guest Player #2-Number",
			handler: awayPenalty2Handler
		},
		"298": {
			"length": 8,
			"justification": "L",
			"title": "Guest Player #2-Penalty Time (mm:ss)"
		},
		"306": {
			"length": 2,
			"justification": "R",
			"title": "Guest Player #3-Number"
		},
		"308": {
			"length": 8,
			"justification": "L",
			"title": "Guest Player #3-Penalty Time (mm:ss)"
		},
		"316": {
			"length": 2,
			"justification": "R",
			"title": "Guest Player #4-Number"
		},
		"318": {
			"length": 8,
			"justification": "L",
			"title": "Guest Player #4-Penalty Time (mm:ss)"
		},
		"326": {
			"length": 2,
			"justification": "R",
			"title": "Guest Player #5-Number"
		},
		"328": {
			"length": 8,
			"justification": "L",
			"title": "Guest Player #5-Penalty Time (mm:ss)"
		},
		"336": {
			"length": 2,
			"justification": "R",
			"title": "Guest Player #6-Number"
		},
		"338": {
			"length": 8,
			"justification": "L",
			"title": "Guest Player #6-Penalty Time (mm:ss)"
		},
		"346": {
			"length": 1,
			"justification": "L",
			"title": "Home Penalty Indicator (' ' or '<')"
		},
		"347": {
			"length": 7,
			"justification": "L",
			"title": "Home Penalty Text-' ‘ or PENALTY"
		},
		"354": {
			"length": 1,
			"justification": "L",
			"title": "Guest Penalty Indicator (' ' or '>')"
		},
		"355": {
			"length": 7,
			"justification": "L",
			"title": "Guest Penalty Text-' ' or PENALTY"
		},
		"362": {
			"length": 2,
			"justification": "R",
			"title": "Home Score - Period 1"
		},
		"364": {
			"length": 2,
			"justification": "R",
			"title": "Home Score - Period 2"
		},
		"366": {
			"length": 2,
			"justification": "R",
			"title": "Home Score - Period 3"
		},
		"368": {
			"length": 2,
			"justification": "R",
			"title": "Home Score - Period 4"
		},
		"370": {
			"length": 2,
			"justification": "R",
			"title": "Home Score - Period 5"
		},
		"372": {
			"length": 2,
			"justification": "R",
			"title": "Home Score - Period 6"
		},
		"374": {
			"length": 2,
			"justification": "R",
			"title": "Home Score - Period 7"
		},
		"376": {
			"length": 2,
			"justification": "R",
			"title": "Home Score - Period 8"
		},
		"378": {
			"length": 2,
			"justification": "R",
			"title": "Home Score - Period 9"
		},
		"380": {
			"length": 2,
			"justification": "R",
			"title": "Home Score - Current Period"
		},
		"382": {
			"length": 2,
			"justification": "R",
			"title": "Guest Score - Period 1"
		},
		"384": {
			"length": 2,
			"justification": "R",
			"title": "Guest Score - Period 2"
		},
		"386": {
			"length": 2,
			"justification": "R",
			"title": "Guest Score - Period 3"
		},
		"388": {
			"length": 2,
			"justification": "R",
			"title": "Guest Score - Period 4"
		},
		"390": {
			"length": 2,
			"justification": "R",
			"title": "Guest Score - Period 5"
		},
		"392": {
			"length": 2,
			"justification": "R",
			"title": "Guest Score - Period 6"
		},
		"394": {
			"length": 2,
			"justification": "R",
			"title": "Guest Score - Period 7"
		},
		"396": {
			"length": 2,
			"justification": "R",
			"title": "Guest Score - Period 8"
		},
		"398": {
			"length": 2,
			"justification": "R",
			"title": "Guest Score - Period 9"
		},
		"400": {
			"length": 2,
			"justification": "R",
			"title": "Guest Score - Current Period"
		},
		"402": {
			"length": 2,
			"justification": "R",
			"title": "Home Shots On Goal - Period 1"
		},
		"404": {
			"length": 2,
			"justification": "R",
			"title": "Home Shots On Goal - Period 2"
		},
		"406": {
			"length": 2,
			"justification": "R",
			"title": "Home Shots On Goal - Period 3"
		},
		"408": {
			"length": 2,
			"justification": "R",
			"title": "Home Shots On Goal - Period 4"
		},
		"410": {
			"length": 2,
			"justification": "R",
			"title": "Home Shots On Goal - Period 5"
		},
		"412": {
			"length": 2,
			"justification": "R",
			"title": "Home Shots On Goal - Period 6"
		},
		"414": {
			"length": 2,
			"justification": "R",
			"title": "Home Shots On Goal - Period 7"
		},
		"416": {
			"length": 2,
			"justification": "R",
			"title": "Home Shots On Goal - Period 8"
		},
		"418": {
			"length": 2,
			"justification": "R",
			"title": "Home Shots On Goal - Period 9"
		},
		"420": {
			"length": 2,
			"justification": "R",
			"title": "Home Shots On Goal - Current"
		},
		"422": {
			"length": 3,
			"justification": "R",
			"title": "Home Shots On Goal - Total",
			handler: homeShotHandler
		},
		"425": {
			"length": 2,
			"justification": "R",
			"title": "Home Saves - Period 1"
		},
		"427": {
			"length": 2,
			"justification": "R",
			"title": "Home Saves - Period 2"
		},
		"429": {
			"length": 2,
			"justification": "R",
			"title": "Home Saves - Period 3"
		},
		"431": {
			"length": 2,
			"justification": "R",
			"title": "Home Saves - Period 4"
		},
		"433": {
			"length": 2,
			"justification": "R",
			"title": "Home Saves - Period 5"
		},
		"435": {
			"length": 2,
			"justification": "R",
			"title": "Home Saves - Period 6"
		},
		"437": {
			"length": 2,
			"justification": "R",
			"title": "Home Saves - Period 7"
		},
		"439": {
			"length": 2,
			"justification": "R",
			"title": "Home Saves - Period 8"
		},
		"441": {
			"length": 2,
			"justification": "R",
			"title": "Home Saves - Period 9"
		},
		"443": {
			"length": 2,
			"justification": "R",
			"title": "Home Saves - Current"
		},
		"445": {
			"length": 3,
			"justification": "R",
			"title": "Home Saves - Total"
		},
		"448": {
			"length": 2,
			"justification": "R",
			"title": "Guest Shots On Goal - Period 1"
		},
		"450": {
			"length": 2,
			"justification": "R",
			"title": "Guest Shots On Goal - Period 2"
		},
		"452": {
			"length": 2,
			"justification": "R",
			"title": "Guest Shots On Goal - Period 3"
		},
		"454": {
			"length": 2,
			"justification": "R",
			"title": "Guest Shots On Goal - Period 4"
		},
		"456": {
			"length": 2,
			"justification": "R",
			"title": "Guest Shots On Goal - Period 5"
		},
		"458": {
			"length": 2,
			"justification": "R",
			"title": "Guest Shots On Goal - Period 6"
		},
		"460": {
			"length": 2,
			"justification": "R",
			"title": "Guest Shots On Goal - Period 7"
		},
		"462": {
			"length": 2,
			"justification": "R",
			"title": "Guest Shots On Goal - Period 8"
		},
		"464": {
			"length": 2,
			"justification": "R",
			"title": "Guest Shots On Goal - Period 9"
		},
		"466": {
			"length": 2,
			"justification": "R",
			"title": "Guest Shots On Goal - Current"
		},
		"468": {
			"length": 3,
			"justification": "R",
			"title": "Guest Shots On Goal - Total",
			handler: awayShotHandler
		},
		"471": {
			"length": 2,
			"justification": "R",
			"title": "Guest Saves - Period 1"
		},
		"473": {
			"length": 2,
			"justification": "R",
			"title": "Guest Saves - Period 2"
		},
		"475": {
			"length": 2,
			"justification": "R",
			"title": "Guest Saves - Period 3"
		},
		"477": {
			"length": 2,
			"justification": "R",
			"title": "Guest Saves - Period 4"
		},
		"479": {
			"length": 2,
			"justification": "R",
			"title": "Guest Saves - Period 5"
		},
		"481": {
			"length": 2,
			"justification": "R",
			"title": "Guest Saves - Period 6"
		},
		"483": {
			"length": 2,
			"justification": "R",
			"title": "Guest Saves - Period 7"
		},
		"485": {
			"length": 2,
			"justification": "R",
			"title": "Guest Saves - Period 8"
		},
		"487": {
			"length": 2,
			"justification": "R",
			"title": "Guest Saves - Period 9"
		},
		"489": {
			"length": 2,
			"justification": "R",
			"title": "Guest Saves - Current"
		},
		"491": {
			"length": 3,
			"justification": "R",
			"title": "Guest Saves - Total"
		}
	}
}
