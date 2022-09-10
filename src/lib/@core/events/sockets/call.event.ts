import type SimplePeer from 'simple-peer';

export class CallEvent {
	roomId!: string;
	initiator!: boolean;
	callerId!: string;
	signal!: SimplePeer.SignalData;
	socketId!: string;

	constructor(partial: Partial<CallEvent>) {
		Object.assign(this, partial);
	}

	get expose() {
		return {
			roomId: this.roomId,
			initiator: this.initiator,
			callerId: this.callerId,
			signal: this.signal
		};
	}
}
