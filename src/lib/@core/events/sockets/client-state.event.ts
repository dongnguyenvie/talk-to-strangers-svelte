import type { Client } from '$lib/types';
import type { SocketID } from '$lib/types/socket';

export class ClientStateEvent implements Pick<Client, 'isVideo' | 'isAudio'> {
	isVideo!: boolean;
	isAudio!: boolean;
	from!: SocketID;
	roomId!: string;

	constructor(partial: Partial<ClientStateEvent>) {
		Object.assign(this, partial);
	}
}
