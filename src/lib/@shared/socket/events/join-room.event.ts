export class JoinRoomEvent {
	roomId!: string;
	socketId!: string;
	isAudio!: boolean;
	isVideo!: boolean;

	constructor(partial: Partial<JoinRoomEvent>) {
		Object.assign(this, partial);
	}
}
