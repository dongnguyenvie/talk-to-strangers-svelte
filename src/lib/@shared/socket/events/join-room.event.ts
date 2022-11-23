export class JoinRoomEvent {
	roomId!: string;
	sid!: string;
	isAudio!: boolean;
	isVideo!: boolean;
	id!: string;

	userInfo!: {
		id: string;
		avatar: string;
		name: string;
	};

	constructor(partial: Partial<JoinRoomEvent>) {
		Object.assign(this, partial);
	}
}
