import {v4} from "uuid";

export type MessageTimer = {
	visible: boolean;
	startedAt: number;
	length: number;
	timerEndsAction: "removeAnnouncement" | "removeTimer" | "nothing";
}

export class Announcement {
	public readonly id: string;
	public message: string;
	public type: string;
	public timer: MessageTimer|null;

	public constructor(message: string, type: string, timer?: MessageTimer) {
		this.id = v4();
		this.message = message;
		this.type = type;
		this.timer = timer ?? null;
	}
}
