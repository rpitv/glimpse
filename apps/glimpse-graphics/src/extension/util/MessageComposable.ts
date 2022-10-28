import { get } from './nodecg';

type ListenerFn = (argument?: any, ack?: (returnVal: any) => void) => void;

export class MessageComposable {

	public channel: string;
	public namespace: string;

	private listeners: ListenerFn[] = [];

	public constructor(channel: string, namespace?: string) {
		this.channel = channel;
		this.namespace = namespace ?? "";
	}

	public async send(argument?: any): Promise<any> {
		// @ts-ignore
		return get().sendMessage(this.namespace + '.' + this.channel, argument);
	}

	public listen(callback: ListenerFn): void {
		this.listeners.push(callback);
		// @ts-ignore
		get().listenFor(this.namespace + '.' + this.channel, callback)
	}

	public destroy(): void {
		for(const listener of this.listeners) {
			get().unlisten(this.namespace + '.' + this.channel, listener);
		}
		this.listeners = [];
	}
}
