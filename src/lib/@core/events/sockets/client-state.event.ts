import type { Client, ClientShareable } from '$lib/types';
import type { SocketID } from '$lib/types/socket';

export class ClientStateEvent implements Pick<Client, 'isVideo' | 'isAudio'> {
	isVideo!: boolean;
	isAudio!: boolean;
	from!: SocketID;
	roomId!: string;
	focusId: SocketID | null = null;
	share!: ClientShareable;

	constructor(partial: Pick<ClientStateEvent, 'roomId'> & Partial<ClientStateEvent>) {
		Object.assign(this, partial);
	}
}
