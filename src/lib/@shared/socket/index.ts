import { auth } from '$lib/state';
import ioClient from 'socket.io-client';
import { get } from 'svelte/store';
const ENDPOINT = import.meta.env.VITE_SOCKET_ENDPOINT;

let token = get(auth)?.token || '';
auth.subscribe(($auth) => {
	token = $auth.token || '';
});
const socket = ioClient(ENDPOINT, {
	reconnection: true,
	query: {
		token: token
	}
});

export const io = socket;
