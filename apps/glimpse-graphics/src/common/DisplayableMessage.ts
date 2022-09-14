export type MessageTimer = {
	visible: boolean;
	startedAt: number;
	length: number;
}

export class DisplayableMessage {
	public readonly message: string;
	public readonly type: "info"|"status";
	public readonly timer: MessageTimer|null;

	public constructor(message: string, type: "info"|"status", timer?: MessageTimer) {
		this.message = message;
		this.type = type;
		this.timer = timer ?? null;
	}
}
