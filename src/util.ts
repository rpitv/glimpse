import {Moment} from "moment";

export const dateFormat = "MMMM Do YYYY hh:mm A";

export function formatChannelName(eventName: string, startTime: Moment): string {
    if(eventName.match(/ vs\.? /)) {
        const [home, away] = eventName.split(/ vs\.? /, 2);
        let sport = "";
        if(home.includes("Women")) {
            sport += "w";
        }
        sport += home.split(" ").reverse()[0].toLowerCase();
        return `${startTime.format("YYYY-MM-DD")}_${sport}_${away.toLowerCase().split(" ")[0]}`;
    } else {
        return `${startTime.format("YYYY-MM-DD")}_${eventName.toLowerCase().replace(/ /g, '_')}`;
    }
}

export function ellipsis(maxLength: number, text: string): string {
    if(text.length > maxLength) {
        return text.substring(0, maxLength - 3) + "...";
    }
    return text;
}
