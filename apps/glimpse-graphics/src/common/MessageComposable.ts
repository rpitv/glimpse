export class MessageComposable {

	public channel: string;
	public namespace: string;

	public constructor(channel: string, namespace?: string) {
		this.channel = channel;
		this.namespace = namespace ?? "";
	}

	public async send(argument?: any): Promise<void> {
		// @ts-ignore
		await nodecg.sendMessage(this.namespace + '.' + this.channel, argument)
	}
}
