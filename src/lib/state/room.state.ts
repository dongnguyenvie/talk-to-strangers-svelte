import { SocketStatus } from '$lib/types/socket';
import { writable, get } from 'svelte/store';
import { auth } from './auth.state';

// Rerferences to HTML elements
export const elements = {
	input: null,
	messages: null
};

const { subscribe, set, update } = writable({
	username: 'Guest-' + Math.floor(100000 + Math.random() * 900000),
	connecting: true,
	connected: false,
	clients: [],
	messages: [],
	status: '',
	clicks: 0
});

export const room = {
	subscribe,
	set,
	update

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
