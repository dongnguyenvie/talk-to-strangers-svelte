import type { Client } from '$lib/types';
import { writable, derived } from 'svelte/store';
import { createClient } from '$lib/@shared/libs/simple-peerjs';
import type { SocketID } from '$lib/types/socket';

interface RoomState {
	socketId: string;
	roomId: string;
	selected?: SocketID;
	accessable: boolean;
	clientsMap: Record<string, Client>;
	messages: never[];
}
const { subscribe, set, update } = writable<RoomState>({
	socketId: '',
	roomId: '',
	selected: '',
	accessable: false,
	clientsMap: {} as Record<SocketID, Client>,
	messages: []
});

const mySocketId = derived({ subscribe }, ($room) => $room.socketId);
const clients = derived({ subscribe }, ($room) => Object.values($room.clientsMap));
const clientsAudio = derived([mySocketId, clients], ($values) => {
	const [mySocketId, clients] = $values;
	return clients.filter((client) => client.socketId !== mySocketId);
});
const myMedia = derived({ subscribe }, ($room) => {
	return $room.clientsMap[$room.socketId as SocketID];
});
const clientIdSelected = derived({ subscribe }, ($room) => $room.selected);
const clientSelected = derived(
	{ subscribe },
	($room) => $room.clientsMap[$room.selected as SocketID]
);

export const room = {
	subscribe,
	set,
	update,
	clients,
	clientsAudio,
	myMedia,
	clientSelected,
	clientIdSelected,
	mySocketId,
	updateClient: (client: Client) => {
		update((data) => {
			data.clientsMap[client.socketId] = client;
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
			return data;
		});
	},
	removePeer: (client: Pick<Client, 'socketId'>) => {
		update((data) => {
			delete data.clientsMap[client.socketId];
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
			data.clientsMap[socketId!] = createClient({
				socketId,
				mediaStream,
				initiator: true
			});

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
	},
	updateClientState: ({
		isAudio,
		isVideo,
		socketId
	}: Pick<Client, 'isAudio' | 'isVideo' | 'socketId'>) => {
		update((data) => {
			const client = data.clientsMap[socketId];
			client.isAudio = isAudio;
			client.isVideo = isVideo;
			return data;
		});
	},
	onSetSelected: (selectdId: SocketID) => {
		update((data) => {
			data.selected = selectdId;
			return data;
		});
	}
};

subscribe((data) => {
	console.log('log::', data);
});
