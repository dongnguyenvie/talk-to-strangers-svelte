import type { Peer } from '$lib/types';
import { SocketStatus } from '$lib/types/socket';
import { writable, get } from 'svelte/store';
import { auth } from './auth.state';

// Rerferences to HTML elements
export const elements = {
	input: null,
	messages: null
};
let clientsMap = {} as Record<string, Peer>;

const { subscribe, set, update } = writable({
	username: 'Guest-' + Math.floor(100000 + Math.random() * 900000),
	socketId: '',
	connecting: true,
	connected: false,
	clients: [] as Peer[],
	clientsMap: {} as Record<string, Peer>,
	messages: [],
	status: '',
	clicks: 0
});

export const room = {
	subscribe,
	set,
	update,
	updatePeer: (peer: Peer) => {
		update((data) => {
			clientsMap[peer.socketId] = peer;
			data.clients = [...Object.values(clientsMap)];
			return { ...data };
		});
	},
	removePeer: (peer: Peer) => {
		update((data) => {
			delete clientsMap[peer.socketId];
			data.clients = [...Object.values(clientsMap)];
			return { ...data };
		});
	}

	// setConnected(connected: boolean) {
	// 	if (connected) {
	// 		update((data) => ({
	// 			...data,
	// 			connected,
	// 			connecting: false,
	// 			status: SocketStatus.CONNECT
	// 		}));
	// 	} else {
	// 		update((data) => ({
	// 			...data,
	// 			connected,
	// 			status: SocketStatus.DISCONNECT
	// 		}));
	// 	}
	// }
};

subscribe((data) => {
	console.log('log::', data);
});
