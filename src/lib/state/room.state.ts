import type { Client } from '$lib/types';
import { writable, get, derived } from 'svelte/store';

const { subscribe, set, update } = writable({
	me: {
		mediaStream: undefined as unknown as MediaStream,
		socketId: ''
	},
	socketId: '',
	roomId: '',
	accessable: false,
	clientsMap: {} as Record<string, Client>,
	messages: []
});

const mySocketId = derived({ subscribe }, ($room) => $room.socketId);
const clients = derived({ subscribe }, ($room) => Object.values($room.clientsMap));
const clientsAudio = derived([mySocketId, clients], ($values) => {
	const [mySocketId, clients] = $values;
	return clients.filter((client) => client.socketId !== mySocketId);
});

export const room = {
	subscribe,
	set,
	update,
	clients,
	clientsAudio,
	updateClient: (client: Client) => {
		update((data) => {
			data.clientsMap[client.socketId] = client;
			data.clientsMap = { ...data.clientsMap };
			return data;
		});
	},
	updateClientStream: (
		client: Pick<Client, 'socketId'> & { isVideo: boolean; isAudio: boolean; stream: MediaStream }
	) => {
		update((data) => {
			if (client.isVideo) {
				data.clientsMap[client.socketId].mediaStream = client.stream;
			} else if (client.isAudio) {
				data.clientsMap[client.socketId].audioStream = client.stream;
			}
			data.clientsMap = { ...data.clientsMap };
			return data;
		});
	},
	removePeer: (client: Pick<Client, 'socketId'>) => {
		update((data) => {
			delete data.clientsMap[client.socketId];
			data.clientsMap = { ...data.clientsMap };
			return data;
		});
	},
	setMyWc: (stream: MediaStream) => {
		update((data) => {
			data.me.mediaStream = stream;
			return data;
		});
	},
	initRoom: ({
		socketId,
		roomId,
		mediaStream
	}: {
		socketId?: string;
		roomId?: string;
		mediaStream?: MediaStream;
	}) => {
		update((data) => {
			data.clientsMap[socketId!] = {
				socketId: socketId!,
				mediaStream: mediaStream!,
				initiator: true,
				peer: undefined as any
			};
			data.clientsMap = { ...data.clientsMap };

			data.socketId = socketId || data.socketId;
			data.roomId = roomId || data.roomId;
			return data;
		});
	},
	updateAccessableStatus: (accessable: boolean) => {
		update((data) => {
			data.accessable = accessable;
			return data;
		});
	}
};

subscribe((data) => {
	console.log('log::', data);
});
