import { SocketStatus } from '$lib/types/socket';
import { writable } from 'svelte/store';

interface SocketState {
	status: SocketStatus;
}
export const socketState = writable<SocketState>({
	status: SocketStatus.DISCONNECT
});
