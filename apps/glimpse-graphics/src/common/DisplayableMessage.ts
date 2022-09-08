export class DisplayableMessage {
	public readonly message: string;
	public readonly type: "info"|"status";

	public constructor(message: string, type: "info"|"status") {
		this.message = message;
		this.type = type;
	}
}
