import type { Client } from '$lib/types';
import { SocketStatus } from '$lib/types/socket';
import { writable, get } from 'svelte/store';
import { auth } from './auth.state';

// Rerferences to HTML elements
export const elements = {
	input: null,
	messages: null
};
let clientsMap = {} as Record<string, Client>;

const { subscribe, set, update } = writable({
	me: {
		mediaStream: undefined as unknown as MediaStream,
		socketId: ''
	},
	clients: [] as Client[],
	clientsMap: {} as Record<string, Client>,
	messages: []
});

export const room = {
	subscribe,
	set,
	update,
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
	updateMe: (me: { socketId?: string; mediaStream?: MediaStream } = {}) => {
		update((data) => {
			console.log(11, data);
			data.me = {
				...data.me,
				...me
			};
			return data;
		});
	}
};

subscribe((data) => {
	console.log('log::', data);
});
